use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io;
use std::io::prelude::*;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct Contents {
    pub token: Option<String>,
    pub endpoint: Option<String>
}

pub struct Config {
    pub path: PathBuf,
    pub contents: Contents,
}

impl Config {
    pub fn load(path: &PathBuf) -> io::Result<Self> {
        let mut file = File::open(path)?;
        let mut file_buf = Vec::new();
        file.read_to_end(&mut file_buf)?;
        let contents: Contents = serde_json::from_slice(&file_buf)?;
        Ok(Config { path: path.clone(), contents })
    }
    pub fn save(&mut self) -> io::Result<()> {
        let json = serde_json::to_string(&self.contents)?;
        let mut file = File::create(&self.path)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }
}
