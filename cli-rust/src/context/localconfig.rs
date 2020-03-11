use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io;
use std::io::prelude::*;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct Contents {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub token: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub endpoint: Option<String>,
}

pub struct Config {
    pub path: PathBuf,
    pub contents: Contents,
}

impl Config {
    fn read(path: &PathBuf) -> io::Result<Vec<u8>> {
        let mut file = File::open(path)?;
        let mut file_buf = Vec::new();
        file.read_to_end(&mut file_buf)?;
        return Ok(file_buf);
    }

    pub fn load(path: &PathBuf) -> io::Result<Self> {
        match Config::read(path) {
            Ok(file_buf) => Ok(Config {
                path: path.clone(),
                contents: serde_json::from_slice(&file_buf)?,
            }),
            Err(_) => {
                let mut config = Config {
                    path: path.clone(),
                    contents: Contents {
                        token: None,
                        endpoint: None,
                    },
                };
                config.save()?;
                return Ok(config);
            }
        }
    }
    pub fn save(&mut self) -> io::Result<()> {
        let json = serde_json::to_string(&self.contents)?;
        let mut file = File::create(&self.path)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }
}
