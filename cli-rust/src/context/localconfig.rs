use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io;
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
    fn read(path: &PathBuf) -> io::Result<Contents> {
        let file = File::open(path)?;
        let result = serde_json::from_reader(file)?;
        Ok(result)
    }

    pub fn load(path: &PathBuf) -> io::Result<Self> {
        match Config::read(path) {
            Ok(contents) => Ok(Config {
                path: path.clone(),
                contents,
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
        let file = File::create(&self.path)?;
        Ok(serde_json::to_writer(file, &self.contents)?)
    }
}
