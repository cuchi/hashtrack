use super::context::Context;
use graphql_client;
use derive_more::From;

pub mod ws;

#[derive(Debug, From)]
pub enum ApiError {
    Reqwest(reqwest::Error),
    Graphql(Option<Vec<graphql_client::Error>>)
}

pub fn build_base_request(context: &Context) -> reqwest::RequestBuilder {
    let builder = reqwest::Client::new().post(&context.get_endpoint());
    match &context.get_token() {
        Some(token) => builder.header("Authorization", token),
        None => builder,
    }
}
