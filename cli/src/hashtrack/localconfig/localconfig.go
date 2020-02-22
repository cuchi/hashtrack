package localconfig

import (
	"encoding/json"
	"io/ioutil"
)

type ConfigFile struct {
	path string
}

type config struct {
	Token string
}

func Init(path string) (*ConfigFile, error) {
	cfgFile := ConfigFile{
		path,
	}

	_, err := cfgFile.load()
	if err != nil {
		var config config
		err = cfgFile.save(config)
		if err != nil {
			return &cfgFile, err
		}
	}

	return &cfgFile, nil
}

func (cfgFile *ConfigFile) SetToken(token string) error {
	config, err := cfgFile.load()
	if err != nil {
		return err
	}
	config.Token = token
	return cfgFile.save(config)
}

func (cfgFile *ConfigFile) GetToken() (string, error) {
	config, err := cfgFile.load()
	return config.Token, err
}

func (cfgFile *ConfigFile) load() (config, error) {
	var config config
	contents, err := ioutil.ReadFile(cfgFile.path)
	if err != nil {
		return config, err
	}

	err = json.Unmarshal(contents, &config)
	if err != nil {
		return config, err
	}

	return config, nil
}

func (cfgFile *ConfigFile) save(config config) error {
	contents, err := json.Marshal(config)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(cfgFile.path, contents, 0o644)
	if err != nil {
		return err
	}

	return nil
}
