use super::api;
use super::context::Context;
use crate::common::try_send_query;
use graphql_client::GraphQLQuery;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "graphql/schema.graphql",
    query_path = "graphql/currentUser.graphql"
)]
struct CurrentUser;

#[derive(Debug)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
}

pub async fn get_current(context: &Context) -> Result<User, api::ApiError> {
    let data: current_user::ResponseData = try_send_query(
        context,
        &CurrentUser::build_query(current_user::Variables {}),
    )
    .await?;
    Ok(User {
        id: data.current_user.id,
        name: data.current_user.name,
        email: data.current_user.email,
    })
}
