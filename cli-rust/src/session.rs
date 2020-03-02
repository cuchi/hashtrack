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

#[derive(Debug)]
pub struct Error(pub String);

impl From<reqwest::Error> for Error {
    fn from(error: reqwest::Error) -> Self {
        let url = match error.url() {
            Some(url) => url.as_str(),
            _ => "<none>",
        };
        Error(format!("Error requesting {}", url))
    }
}

fn get_error_message(res: Response<create_session::ResponseData>) -> String {
    match res.errors {
        Some(errors) => match errors.get(0) {
            Some(error) => String::from(&error.message),
            None => "Unknown error".to_string(),
        },
        None => "Unknown error".to_string(),
    }
}

pub async fn create(email: String, password: String) -> Result<Session, Error> {
    let vars = create_session::Variables { email, password };
    let request_body = CreateSession::build_query(vars);
    let client = reqwest::Client::new();
    let res = client
        .post("https://hashtrack.herokuapp.com/graphql")
        .json(&request_body)
        .send()
        .await?
        .json::<Response<create_session::ResponseData>>()
        .await?;
    match res.data {
        Some(data) => Ok(Session {
            token: data.create_session.token,
        }),
        _ => Err(Error(get_error_message(res).to_string())),
    }
}
