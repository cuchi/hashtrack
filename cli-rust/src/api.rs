use derive_more::From;
use graphql_client;

pub mod ws;

#[derive(Debug, From)]
pub enum ApiError {
    Reqwest(reqwest::Error),
    Graphql(Option<Vec<graphql_client::Error>>),
}
