use super::api;
use super::context::Context;
use graphql_client::GraphQLQuery;
use graphql_client::Response;

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

pub async fn get_current(context: &Context) -> Result<User, api::Error> {
    let res = api::build_base_request(context)
        .json(&CurrentUser::build_query(current_user::Variables {}))
        .send()
        .await?
        .json::<Response<current_user::ResponseData>>()
        .await?;
    match res.data {
        Some(data) => Ok(User {
            id: data.current_user.id,
            name: data.current_user.name,
            email: data.current_user.email,
        }),
        _ => Err(api::Error(api::get_error_message(res).to_string())),
    }
}
