use super::api;
use super::context::Context;
use ansi_term::Color;
use api::ws;
use api::ws::WsMessage;
use chrono::{DateTime, FixedOffset};
use graphql_client::GraphQLQuery;
use graphql_client::Response;
use serde::{Deserialize, Serialize};
use std::fmt;
use std::sync::mpsc;
use std::sync::mpsc::{Receiver, Sender};
use std::thread;
use textwrap::Wrapper;
use websocket::OwnedMessage;

const WRAPPER: Wrapper<'_, textwrap::NoHyphenation> = Wrapper {
    splitter: textwrap::NoHyphenation,
    initial_indent: "    ",
    subsequent_indent: "    ",
    break_words: false,
    width: 60,
};

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/tweets.graphql"
)]
struct Tweets;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/newTweet.graphql"
)]
struct NewTweet;

#[derive(Serialize, Deserialize, Debug)]
pub struct Tweet {
    pub id: String,
    #[serde(rename = "authorName")]
    pub author_name: String,
    pub text: String,
    #[serde(rename = "publishedAt")]
    pub published_at: DateTime<FixedOffset>,
}

impl fmt::Display for Tweet {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let url = format!(
            "https://twitter.com/{}/status/{}",
            self.author_name.replace("@", ""),
            self.id
        );
        write!(
            f,
            "{} - {}\n{}\n{}\n",
            Color::Cyan.bold().paint(&self.author_name),
            &self.published_at,
            WRAPPER.fill(&self.text),
            Color::RGB(80, 100, 100).bold().paint(&url),
        )
    }
}

pub async fn get_latest(context: &Context, search: String) -> Result<Vec<Tweet>, api::Error> {
    let res = api::build_base_request(context)
        .json(&Tweets::build_query(tweets::Variables { search }))
        .send()
        .await?
        .json::<Response<tweets::ResponseData>>()
        .await?;
    match res.data {
        Some(data) => Ok(data
            .tweets
            .iter()
            .rev()
            .map(|tweet| Tweet {
                id: tweet.id.clone(),
                author_name: tweet.author_name.clone(),
                text: tweet.text.clone(),
                published_at: DateTime::parse_from_rfc3339(&tweet.published_at).unwrap(),
            })
            .collect()),
        _ => Err(api::Error(api::get_error_message(res).to_string())),
    }
}

pub fn stream_latest(context: &Context, search: String) -> Receiver<Tweet> {
    let (tx, rx): (Sender<Tweet>, Receiver<Tweet>) = mpsc::channel();
    let init_connection = ws::get_connection_init_message(context);
    let endpoint = context.get_endpoint();
    thread::spawn(move || {
        let mut client = ws::build_client(endpoint);
        client
            .send_message(&OwnedMessage::Binary(init_connection))
            .unwrap();
        let first_message = match client.recv_message().unwrap() {
            OwnedMessage::Text(data) => serde_json::from_str::<WsMessage<String>>(&data).unwrap(),
            _ => return,
        };
        if !ws::is_ack_message(first_message) {
            return;
        }
        let start_message =
            ws::build_start_message(NewTweet::build_query(new_tweet::Variables { search }));
        client.send_message(&start_message).unwrap();
        loop {
            let message = match client.recv_message().unwrap() {
                OwnedMessage::Text(data) => {
                    serde_json::from_str::<WsMessage<Response<new_tweet::ResponseData>>>(&data)
                        .unwrap()
                }
                OwnedMessage::Binary(data) => {
                    serde_json::from_slice::<WsMessage<Response<new_tweet::ResponseData>>>(&data)
                        .unwrap()
                }
                _ => return,
            };
            let tweet = message.payload.unwrap().data.unwrap().new_tweet;
            tx.send(Tweet {
                id: tweet.id,
                text: tweet.text,
                author_name: tweet.author_name,
                published_at: DateTime::parse_from_rfc3339(&tweet.published_at).unwrap(),
            })
            .unwrap();
        }
    });
    return rx;
}
