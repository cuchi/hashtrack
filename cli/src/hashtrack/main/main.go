package main

import (
	"fmt"
	"hashtrack/localconfig"
	"hashtrack/session"
	"hashtrack/tweet"
	"log"
	"os"

	"github.com/Laisky/graphql"
	"github.com/jessevdk/go-flags"
)

type options = struct {
	Endpoint string `short:"e"`
	Config   string `short:"c"`
}

func getOptions() ([]string, options) {
	var opts options
	args, err := flags.Parse(&opts)
	if err != nil {
		panic(err)
	}

	if opts.Endpoint == "" {
		opts.Endpoint = "https://hashtrack.herokuapp.com/graphql"
	}

	if opts.Config == "" {
		opts.Config = fmt.Sprintf("%s/.hashtrack.config", os.Getenv("HOME"))
	}

	return args, opts
}

func main() {
	args, opts := getOptions()

	if len(args) == 0 {
		log.Println("Print usage")
		return
	}

	switch args[0] {
	case "login":
		var email string
		var password string
		configOpts, err := localconfig.Init(opts.Config)
		if err != nil {
			panic(err)
		}

		fmt.Print("Email: ")
		fmt.Scan(&email)
		fmt.Print("Password: ")
		fmt.Scan(&password)

		client := graphql.NewClient(opts.Endpoint, nil)
		token, err := session.Create(
			client,
			session.CreationPayload{email, password},
		)
		if err != nil {
			panic(err)
		}

		configOpts.SetToken(token)
		fmt.Println("Login succeeded!")

	case "logout":
		configOpts, err := localconfig.Init(opts.Config)
		if err != nil {
			panic(err)
		}

		token, _ := configOpts.GetToken()
		if token == "" {
			fmt.Println("You are not logged in, skipping...")
			return
		}
		configOpts.SetToken("")

	case "list":
		configOpts, err := localconfig.Init(opts.Config)
		if err != nil {
			panic(err)
		}
		token, _ := configOpts.GetToken()
		if token == "" {
			fmt.Println("You are not logged in!")
			return
		}

		client := graphql.NewClient(
			opts.Endpoint,
			nil,
			graphql.WithHeader("Authorization", token),
		)

		tweet.List(client, "")
	default:
		fmt.Errorf("%s is not a valid command", args[0])
	}

	// client := graphql.NewClient(endpoint, nil)
}
