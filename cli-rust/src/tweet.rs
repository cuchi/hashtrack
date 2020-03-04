use super::api;
use super::context::Context;
use graphql_client::GraphQLQuery;
use graphql_client::Response;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/tweets.graphql"
)]
struct Tweets;

#[derive(Debug)]
pub struct Tweet {
    pub id: String,
    pub author_name: String,
    pub text: String,
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
            .map(|tweet| Tweet {
                id: tweet.id.clone(),
                author_name: tweet.author_name.clone(),
                text: tweet.text.clone(),
            })
            .collect()),
        _ => Err(api::Error(api::get_error_message(res).to_string())),
    }
}
