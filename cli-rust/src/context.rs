use localconfig::Config;
use std::env;
use std::io;
use std::path::PathBuf;

pub mod localconfig;

const DEFAULT_ENDPOINT: &str = "https://hashtrack.herokuapp.com/graphql";

pub struct Context {
    pub endpoint: String,
    config: Config
}

#[derive(Debug)]
pub struct ContextError {
    message: String,
}

impl From<io::Error> for ContextError {
    fn from(error: io::Error) -> Self {
        ContextError {
            message: error.to_string(),
        }
    }
}

impl From<env::VarError> for ContextError {
    fn from(error: env::VarError) -> Self {
        ContextError {
            message: error.to_string(),
        }
    }
}

impl Context {
    pub fn new(config_opt: Option<String>, endpoint_opt : Option<String>) -> Result<Self, ContextError> {
        let mut config_path = PathBuf::new();
        match config_opt {
            Some(path) => {
                config_path.push(path);
            }
            None => {
                config_path.push(
                    &env::var("HOME")
                        .expect("Either -e flag or HOME environment variable should be set"));
                config_path.push(".hashtrack.config");
            }
        };
        let config = Config::load(&config_path)?;
        let endpoint = endpoint_opt.unwrap_or(
            config
                .contents
                .endpoint
                .as_deref()
                .unwrap_or(DEFAULT_ENDPOINT)
                .to_string(),
        );
        Ok(Context {
            endpoint,
            config
        })
    }

    pub fn set_token(&mut self, token: Option<String>) -> io::Result<()> {
        self.config.contents.token = token;
        self.config.save()
    }

    pub fn token(&self) -> Option<&str> {
        self.config.contents.token.as_deref()
    }
}
