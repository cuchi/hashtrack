package main

import (
	"fmt"
	"hashtrack/context"
	"hashtrack/session"
	"hashtrack/tweets"
	"hashtrack/user"
	"os"
)

func login(ctx *context.Context) error {
	var email string
	var password string

	fmt.Print("Email: ")
	fmt.Scan(&email)
	fmt.Print("Password: ")
	fmt.Scan(&password)

	ctx.Config.Token = ""
	token, err := session.Create(
		ctx.GetClient(),
		session.CreationPayload{email, password},
	)
	if err != nil {
		return err
	}

	ctx.Config.Token = token
	ctx.Config.Save()
	fmt.Println("Login succeeded!")
	return nil
}

func logout(ctx *context.Context) error {
	if ctx.Config.Token == "" {
		fmt.Println("You are not logged in, skipping...")
		return nil
	}
	ctx.Config.Token = ""
	return ctx.Config.Save()
}

func list(ctx *context.Context) error {
	if ctx.Config.Token == "" {
		fmt.Println("You are not logged in!")
		return nil
	}
	lastTweets, err := tweets.List(ctx.GetClient(), "")
	if err != nil {
		return err
	}
	for _, tweet := range lastTweets {
		fmt.Println(tweets.Pretty(tweet))
	}
	return nil
}

func status(ctx *context.Context) error {
	if ctx.Config.Token == "" {
		fmt.Println("Not logged in.")
		return nil
	}
	user, err := user.GetCurrent(ctx.GetClient())
	if err != nil {
		return err
	}
	fmt.Printf("Logged in as %s (%s)\n", user.Name, user.Email)
	return nil
}

const usage = `
Usage:
	hashtrack COMMAND [OPTIONS, ...]

Commands:
	login
	logout
	list

Options:
	--endpoint, -e 
	--config, -c
`

func main() {
	ctx, _ := context.Init()

	if len(ctx.Args) == 0 {
		fmt.Println(usage)
		os.Exit(1)
	}

	var err error
	switch ctx.Args[0] {
	case "login":
		err = login(ctx)
	case "logout":
		err = logout(ctx)
	case "list":
		err = list(ctx)
	case "status":
		err = status(ctx)
	default:
		fmt.Printf("%s is not a valid command\n", ctx.Args[0])
		fmt.Println(usage)
		os.Exit(1)
	}

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
