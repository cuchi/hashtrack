use getopts::{Matches, Options};
use localconfig::Config;
use std::env;
use std::io;
use std::path::PathBuf;

pub mod localconfig;

const DEFAULT_ENDPOINT: &str = "https://hashtrack.herokuapp.com/graphql";

pub struct Context {
    matches: Matches,
    args: Vec<String>,
    config: Config,
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
    pub fn new(args: Vec<String>, opts: Options) -> Result<Self, ContextError> {
        let matches = opts.parse(&args[1..]).unwrap();
        let mut config_path = PathBuf::new();
        match matches.opt_str("config") {
            Some(path) => {
                config_path.push(path);
            }
            None => {
                config_path.push(&env::var("HOME")?);
                config_path.push(".hashtrack.config");
            }
        };
        Ok(Context {
            matches: matches,
            args,
            config: Config::load(&config_path)?,
        })
    }
    pub fn next_arg(&mut self) -> Option<String> {
        let arg = self.args.get(0).map(String::clone);
        if self.args.len() > 0 {
            self.args.remove(0);
        }

        return arg;
    }

    pub fn set_token(&mut self, token: String) -> io::Result<()> {
        self.config.contents.token = token;
        self.config.save()
    }
    pub fn get_endpoint(&self) -> String {
        self.matches.opt_str("endpoint").unwrap_or(
            self.config
                .contents
                .endpoint
                .as_ref()
                .unwrap_or(&DEFAULT_ENDPOINT.to_string())
                .to_string(),
        )
    }
}
