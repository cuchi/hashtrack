use super::api;
use super::context::Context;
use graphql_client::Response;
use serde::{Deserialize, Serialize};

pub async fn try_send_query<T: Serialize + ?Sized, R: for <'a> Deserialize<'a>>(context: &Context, json: &T) -> Result<R, api::ApiError> {
    let res = build_base_request(context)
        .json(json)
        .send()
        .await?
        .json::<Response<R>>()
        .await?;
    let errors = res.errors;
    let data = res.data.ok_or_else(|| api::ApiError::Graphql(errors))?;
    Ok(data)
}

fn build_base_request(context: &Context) -> reqwest::RequestBuilder {
    let builder = reqwest::Client::new().post(&context.endpoint);
    match context.token() {
        Some(token) => builder.header("Authorization", token),
        None => builder,
    }
}