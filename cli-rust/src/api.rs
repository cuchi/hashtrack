use graphql_client;
use derive_more::From;

pub mod ws;

#[derive(Debug, From)]
pub enum ApiError {
    Reqwest(reqwest::Error),
    Graphql(Option<Vec<graphql_client::Error>>)
}
