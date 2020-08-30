use super::api;
use super::context::Context;
use crate::common::try_send_query;
use graphql_client::GraphQLQuery;

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
    let data: create_session::ResponseData =
        try_send_query(context, &CreateSession::build_query(creation)).await?;
    Ok(Session {
        token: data.create_session.token,
    })
}
