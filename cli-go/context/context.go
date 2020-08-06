package context

import (
	"fmt"
	"hashtrack/localconfig"
	"os"

	"github.com/Laisky/graphql"
	"github.com/jessevdk/go-flags"
)

const DEFAULT_ENDPOINT = "https://hashtrack.herokuapp.com/graphql"

type Options struct {
	Endpoint string `short:"e"`
	Config   string `short:"c"`
}

type Context struct {
	Options          Options
	args             []string
	Config           *localconfig.Config
	client           *graphql.Client
	initializedToken string
}

func Init() (*Context, error) {
	var context Context
	args, options, err := getUserOptions()
	if err != nil {
		return &context, err
	}
	config, err := initConfig(options)
	if err != nil {
		return &context, err
	}

	context.args = args
	context.Config = config
	context.Options = mergeOptionsWithConfig(options, config)

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
	if ctx.client == nil || ctx.Config.Token != ctx.initializedToken {
		ctx.initClient()
	}

	return ctx.client
}

func (ctx *Context) NextArg() string {
	if len(ctx.args) == 0 {
		return ""
	}
	arg := ctx.args[0]
	ctx.args = ctx.args[1:]
	return arg
}

func initConfig(opts Options) (*localconfig.Config, error) {
	configLocation := opts.Config
	if configLocation == "" {
		configLocation = fmt.Sprintf("%s/.hashtrack.config", os.Getenv("HOME"))
	}
	return localconfig.Init(configLocation)
}

func mergeOptionsWithConfig(opts Options, config *localconfig.Config) Options {
	var newOpts Options
	newOpts.Endpoint = DEFAULT_ENDPOINT
	if opts.Endpoint != "" {
		newOpts.Endpoint = opts.Endpoint
	} else if config.Endpoint != "" {
		newOpts.Endpoint = config.Endpoint
	}
	return newOpts
}

func getUserOptions() ([]string, Options, error) {
	var opts Options
	args, err := flags.Parse(&opts)
	return args, opts, err
}
