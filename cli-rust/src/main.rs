extern crate chrono;
extern crate getopts;
extern crate rpassword;

use context::Context;
use getopts::Options;
use rpassword::read_password_from_tty;
use std::env;
use std::io;
use text_io::read;
use tokio::runtime::Runtime;

mod api;
mod context;
mod session;
mod track;
mod tweet;
mod user;

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

impl From<api::Error> for CliError {
    fn from(error: api::Error) -> Self {
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
    let session = session::create(context, session::Creation { email, password }).await?;
    context.set_token(Some(session.token))?;
    println!("Login succeeded!");
    Ok(())
}

async fn status(context: &Context) -> Result<(), CliError> {
    let user = user::get_current(context).await?;
    println!("{:?}", user);
    Ok(())
}

fn logout(context: &mut Context) -> Result<(), CliError> {
    context.set_token(None)?;
    Ok(())
}

async fn get_latest_tweets(context: &Context) -> Result<(), CliError> {
    tweet::get_latest(context, String::from(""))
        .await?
        .iter()
        .for_each(|tweet| {
            println!("{}", tweet);
        });
    Ok(())
}

fn stream_latest_tweets(context: &Context) -> Result<(), CliError> {
    let receiver = tweet::stream_latest(context, String::from(""));
    loop {
        match receiver.recv() {
            Ok(tweet) => println!("{}", tweet),
            Err(_) => break,
        };
    }
    Ok(())
}

async fn list_tracks(context: &Context) -> Result<(), CliError> {
    track::get_all(context).await?.iter().for_each(|track| {
        println!("{}", track);
    });
    Ok(())
}

async fn create_track(context: &mut Context) -> Result<(), CliError> {
    match context.next_arg() {
        Some(hashtag) => {
            let track = track::create(context, track::Creation { hashtag }).await?;
            println!("Now tracking {}...", track.pretty_name);
            Ok(())
        },
        _ => Err(CliError {
            message: String::from("Expected hashtag name to start tracking"),
            is_usage_error: false,
        })
    }
}

async fn remove_track(context: &mut Context) -> Result<(), CliError> {
    match context.next_arg() {
        Some(hashtag) => {
            let track = track::remove(context, track::Removal { hashtag }).await?;
            println!("Stopped tracking {}", track.pretty_name);
            Ok(())
        },
        _ => Err(CliError {
            message: String::from("Expected hashtag name to untrack"),
            is_usage_error: false,
        })
    }
}

fn run_subcommand(context: &mut Context) -> Result<(), CliError> {
    let mut runtime = Runtime::new().unwrap();
    match context.next_arg().as_ref().map(String::as_str) {
        Some("status") => runtime.block_on(status(context)),
        Some("login") => runtime.block_on(login(context)),
        Some("logout") => logout(context),
        Some("list") => runtime.block_on(get_latest_tweets(context)),
        Some("watch") => stream_latest_tweets(context),
        Some("tracks") => runtime.block_on(list_tracks(context)),
        Some("track") => runtime.block_on(create_track(context)),
        Some("untrack") => runtime.block_on(remove_track(context)),
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
    let mut context = Context::new(env::args().collect(), opts).unwrap();

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
