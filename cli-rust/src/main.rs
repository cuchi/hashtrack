extern crate getopts;
extern crate rpassword;

use context::Context;
use getopts::Options;
use rpassword::read_password_from_tty;
use std::env;
use std::io;
use text_io::read;
use tokio::runtime::Runtime;

mod context;
mod session;

struct CliError {
    message: String,
    is_usage_error: bool,
}

impl From<io::Error> for CliError {
    fn from(error: io::Error) -> Self {
        CliError {
            message: error.to_string(),
            is_usage_error: false,
        }
    }
}

impl From<session::Error> for CliError {
    fn from(error: session::Error) -> Self {
        CliError {
            message: error.0,
            is_usage_error: false,
        }
    }
}

async fn login(context: &mut Context) -> Result<(), CliError> {
    println!("Email: ");
    let email: String = read!();
    println!("Password: ");
    let password = read_password_from_tty(None)?;
    let session = session::create(email, password).await?;
    context.set_token(session.token)?;
    println!("Login succeeded!");
    Ok(())
}

fn run_subcommand(context: &mut Context) -> Result<(), CliError> {
    let mut runtime = Runtime::new().unwrap();
    match context.next_arg().as_ref().map(String::as_str) {
        Some("login") => runtime.block_on(login(context)),
        Some("logout") => {
            println!("Logout!");
            Ok(())
        }
        Some("list") => {
            println!("List!");
            Ok(())
        }
        Some("watch") => {
            println!("Watch!");
            Ok(())
        }
        Some("tracks") => {
            println!("Tracks!");
            Ok(())
        }
        Some("track") => {
            println!("Track!");
            Ok(())
        }
        Some("untrack") => {
            println!("Untrack!");
            Ok(())
        }
        Some(x) => Err(CliError {
            message: format!("Unknown command {}", x).to_string(),
            is_usage_error: true,
        }),
        _ => Err(CliError {
            message: "Missing argument".to_string(),
            is_usage_error: true,
        }),
    }
}

fn main() {
    let mut opts = Options::new();
    opts.optopt("e", "endpoint", "The hashtrack service endpoint", "ENPOINT")
        .optopt("c", "config", "The config file location", "PATH_TO_CONFIG");
    let args: Vec<String> = env::args().collect();
    let mut context = Context::new(args[1..].to_vec(), opts).unwrap();

    match run_subcommand(&mut context) {
        Ok(_) => (),
        Err(error) => {
            println!("{}", error.message);
            if error.is_usage_error {
                println!("Print usage here...")
            }
        }
    }
}
