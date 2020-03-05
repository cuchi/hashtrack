use super::context::Context;
use graphql_client::Response;

pub mod ws;

#[derive(Debug)]
pub struct Error(pub String);

trait ResponseData {}

impl From<reqwest::Error> for Error {
    fn from(error: reqwest::Error) -> Self {
        let url = match error.url() {
            Some(url) => url.as_str(),
            _ => "<none>",
        };
        Error(format!("Error requesting {}", url))
    }
}

pub fn get_error_message<T>(res: Response<T>) -> String {
    match res.errors {
        Some(errors) => match errors.get(0) {
            Some(error) => String::from(&error.message),
            None => "Unknown error".to_string(),
        },
        None => "Unknown error".to_string(),
    }
}

pub fn build_base_request(context: &Context) -> reqwest::RequestBuilder {
    let builder = reqwest::Client::new().post(&context.get_endpoint());
    match &context.get_token() {
        Some(token) => builder.header("Authorization", token),
        None => builder,
    }
}
