package context

import (
	"fmt"
	"hashtrack/localconfig"
	"os"

	"github.com/Laisky/graphql"
	"github.com/jessevdk/go-flags"
)

type Options struct {
	Endpoint string `short:"e"`
	Config   string `short:"c"`
}

type Context struct {
	Options          Options
	Args             []string
	Config           *localconfig.Config
	client           *graphql.Client
	initializedToken string
}

func Init() (*Context, error) {
	var context Context
	args, options := getOptions()
	context.Args = args
	context.Options = options
	config, err := localconfig.Init(options.Config)
	if err != nil {
		return &context, err
	}
	context.Config = config

	return &context, nil
}

func (ctx *Context) initClient() {
	var clientOpts []graphql.ClientOptFunc
	if ctx.Config.Token != "" {
		clientOpts = append(
			clientOpts,
			graphql.WithHeader("Authorization", ctx.Config.Token),
		)
	}

	ctx.client = graphql.NewClient(
		ctx.Options.Endpoint,
		nil,
		clientOpts...,
	)
}

func (ctx *Context) GetClient() *graphql.Client {
	if ctx.client != nil || ctx.Config.Token != ctx.initializedToken {
		ctx.initClient()
	}

	return ctx.client
}

func getOptions() ([]string, Options) {
	var opts Options
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
