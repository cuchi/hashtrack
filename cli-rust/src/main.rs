use context::Context;
use rpassword::read_password_from_tty;
use std::io;
use text_io::read;
use structopt::StructOpt;
use crate::opts::{HashtrackOpt, HashtrackCommand};
use derive_more::From;

mod api;
mod common;
mod context;
mod opts;
mod session;
mod track;
mod tweet;
mod user;

#[derive(Debug, From)]
enum CliError {
    IoError(io::Error),
    ApiError(api::ApiError)
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

async fn create_track(context: &mut Context, hashtag: String) -> Result<(), CliError> {
    let track = track::create(context, track::Creation { hashtag }).await?;
    println!("Now tracking {}...", track.pretty_name);
    Ok(())
}

async fn remove_track(context: &mut Context, hashtag: String) -> Result<(), CliError> {
    let track = track::remove(context, track::Removal { hashtag }).await?;
    println!("Stopped tracking {}", track.pretty_name);
    Ok(())
}

async fn run_subcommand(context: &mut Context, opts: HashtrackCommand) -> Result<(), CliError> {
    match opts {
        HashtrackCommand::Status => status(context).await,
        HashtrackCommand::Login => login(context).await,
        HashtrackCommand::Logout => logout(context),
        HashtrackCommand::List => get_latest_tweets(context).await,
        HashtrackCommand::Watch => stream_latest_tweets(context),
        HashtrackCommand::Tracks => list_tracks(context).await,
        HashtrackCommand::Track {hashtag} => create_track(context, hashtag).await,
        HashtrackCommand::Untrack {hashtag} => remove_track(context, hashtag).await,
    }
}

#[tokio::main]
async fn main() {
    let opt: HashtrackOpt = HashtrackOpt::from_args();
    let mut context = Context::new(opt.config, opt.endpoint).unwrap();

    match run_subcommand(&mut context, opt.command).await {
        Ok(_) => (),
        Err(error) => {
            println!("{:?}", error);
        }
    }
}
