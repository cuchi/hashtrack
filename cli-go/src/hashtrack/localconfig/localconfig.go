package localconfig

import (
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	Token    string
	Endpoint string
	path     string
}

func Init(path string) (*Config, error) {
	var config Config
	config.path = path

	err := config.Load()
	if err != nil {
		err = config.Save()
		if err != nil {
			return &config, err
		}
	}

	return &config, nil
}

func (config *Config) Load() error {
	contents, err := ioutil.ReadFile(config.path)
	if err != nil {
		return err
	}

	err = json.Unmarshal(contents, config)
	if err != nil {
		return err
	}
	return nil
}

func (config *Config) Save() error {
	contents, err := json.MarshalIndent(config, "", "    ")
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(config.path, contents, 0o644)
	if err != nil {
		return err
	}

	return nil
}
