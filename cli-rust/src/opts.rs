use structopt::StructOpt;

#[derive(StructOpt)]
pub struct HashtrackOpt {
    #[structopt(short, long)]
    pub config: Option<String>,
    #[structopt(short, long)]
    pub endpoint: Option<String>,
    #[structopt(subcommand)]
    pub command: HashtrackCommand
}


#[derive(StructOpt)]
#[structopt(about = "hashtrack COMMAND [OPTIONS, ...]")]
pub enum HashtrackCommand {
    Status,
    Login,
    Logout,
    List,
    Watch,
    Tracks,
    Track {
        #[structopt(short, long)]
        hashtag: String
    },
    Untrack {
        #[structopt(short, long)]
        hashtag: String
    },
}


