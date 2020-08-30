use super::api;
use super::context::Context;
use graphql_client::GraphQLQuery;
use graphql_client::Response;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/createSession.graphql"
)]
struct CreateSession;

#[derive(Debug)]
pub struct Session {
    pub token: String,
}

pub type Creation = create_session::Variables;

pub async fn create(context: &Context, creation: Creation) -> Result<Session, api::ApiError> {
    let res = api::build_base_request(context)
        .json(&CreateSession::build_query(creation))
        .send()
        .await?
        .json::<Response<create_session::ResponseData>>()
        .await?;
    let errors = res.errors;
    let data = res.data.ok_or_else(|| errors)?;
    Ok(Session {
        token: data.create_session.token,
    })
}
