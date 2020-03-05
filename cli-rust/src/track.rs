use super::api;
use super::context::Context;
use ansi_term::Color;
use chrono::{DateTime, FixedOffset};
use graphql_client::{GraphQLQuery, Response};
use std::fmt;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/tracks.graphql"
)]
struct Tracks;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/createTrack.graphql"
)]
struct CreateTrack;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/removeTrack.graphql"
)]
struct RemoveTrack;

pub type Creation = create_track::Variables;
pub type Removal = remove_track::Variables;

pub struct Track {
    pub hashtag_name: String,
    pub pretty_name: String,
    pub created_at: DateTime<FixedOffset>,
}

impl fmt::Display for Track {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let hashtag_name = format!("#{}", self.hashtag_name);
        if self.pretty_name == hashtag_name {
            write!(
                f,
                "{} - created at {}",
                Color::Cyan.bold().paint(hashtag_name),
                self.created_at
            )
        } else {
            write!(
                f,
                "{} ({}) - created at {}",
                Color::Cyan.bold().paint(&self.pretty_name),
                hashtag_name,
                self.created_at
            )
        }
    }
}

pub async fn get_all(context: &Context) -> Result<Vec<Track>, api::Error> {
    let res = api::build_base_request(context)
        .json(&Tracks::build_query(tracks::Variables {}))
        .send()
        .await?
        .json::<Response<tracks::ResponseData>>()
        .await?;
    match res.data {
        Some(data) => Ok(data
            .tracks
            .iter()
            .map(|track| Track {
                hashtag_name: track.hashtag_name.clone(),
                pretty_name: track.pretty_name.clone(),
                created_at: DateTime::parse_from_rfc3339(&track.created_at).unwrap(),
            })
            .collect()),
        _ => Err(api::Error(api::get_error_message(res).to_string())),
    }
}

pub async fn create(context: &Context, creation: Creation) -> Result<Track, api::Error> {
    let res = api::build_base_request(context)
        .json(&CreateTrack::build_query(creation))
        .send()
        .await?
        .json::<Response<create_track::ResponseData>>()
        .await?;
    match res.data {
        Some(data) => Ok(Track {
            hashtag_name: data.create_track.hashtag_name.clone(),
            pretty_name: data.create_track.pretty_name.clone(),
            created_at: DateTime::parse_from_rfc3339(&data.create_track.created_at).unwrap(),
        }),
        _ => Err(api::Error(api::get_error_message(res).to_string())),
    }
}

pub async fn remove(context: &Context, removal: Removal) -> Result<Track, api::Error> {
    let res = api::build_base_request(context)
        .json(&RemoveTrack::build_query(removal))
        .send()
        .await?
        .json::<Response<remove_track::ResponseData>>()
        .await?;
    match res.data {
        Some(data) => Ok(Track {
            hashtag_name: data.remove_track.hashtag_name.clone(),
            pretty_name: data.remove_track.pretty_name.clone(),
            created_at: DateTime::parse_from_rfc3339(&data.remove_track.created_at).unwrap(),
        }),
        _ => Err(api::Error(api::get_error_message(res).to_string())),
    }
}
