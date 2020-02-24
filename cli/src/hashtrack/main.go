package main

import (
	"fmt"
	"hashtrack/context"
	"hashtrack/session"
	"hashtrack/tweets"
	"hashtrack/user"
)

func login(ctx *context.Context) {
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
		panic(err)
	}

	ctx.Config.Token = token
	ctx.Config.Save()
	fmt.Println("Login succeeded!")
}

func logout(ctx *context.Context) {
	if ctx.Config.Token == "" {
		fmt.Println("You are not logged in, skipping...")
		return
	}
	ctx.Config.Token = ""
	ctx.Config.Save()
}

func list(ctx *context.Context) {
	if ctx.Config.Token == "" {
		fmt.Println("You are not logged in!")
		return
	}
	lastTweets, _ := tweets.List(ctx.GetClient(), "")
	for _, tweet := range lastTweets {
		fmt.Println(tweets.Pretty(tweet))
	}
}

func status(ctx *context.Context) {
	if ctx.Config.Token == "" {
		fmt.Println("Not logged in.")
		return
	}
	user, _ := user.GetCurrent(ctx.GetClient())
	fmt.Printf("Logged in as %s (%s)\n", user.Name, user.Email)
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
		return
	}

	switch ctx.Args[0] {
	case "login":
		login(ctx)
	case "logout":
		logout(ctx)
	case "list":
		list(ctx)
	case "status":
		status(ctx)
	default:
		fmt.Printf("%s is not a valid command\n", ctx.Args[0])
		fmt.Println(usage)
	}
}
