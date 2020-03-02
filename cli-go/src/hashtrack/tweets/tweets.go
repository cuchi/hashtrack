package tweets

import (
	"context"
	"errors"
	"fmt"
	"hashtrack/term"
	"strings"
	"time"

	"github.com/Laisky/graphql"
)

type Tweet struct {
	Id          string
	PublishedAt time.Time
	AuthorName  string
	Text        string
}

type listQuery struct {
	Tweets []struct {
		Id          graphql.ID
		PublishedAt graphql.String
		AuthorName  graphql.String
		Text        graphql.String
	} `graphql:"tweets(search: $search)"`
}

func List(client *graphql.Client, search string) ([]Tweet, error) {
	var query listQuery
	variables := map[string]interface{}{
		"search": graphql.String(search),
	}
	err := client.Query(context.Background(), &query, variables)

	tweets := []Tweet{}
	for _, tweet := range query.Tweets {
		id, ok := tweet.Id.(string)
		if !ok {
			return tweets, errors.New(
				"Expected a string when parsing the tweet Id",
			)
		}

		publishedAt, err := time.Parse(time.RFC3339, string(tweet.PublishedAt))
		if err != nil {
			return tweets, err
		}

		newTweet := Tweet{
			AuthorName:  string(tweet.AuthorName),
			Text:        string(tweet.Text),
			PublishedAt: publishedAt,
			Id:          id,
		}

		tweets = append([]Tweet{newTweet}, tweets...)
	}
	return tweets, err
}

// TODO: Find a way to use GraphQL subscriptions in Go instead of bashing the
// API every 5 secs.
func watchTweets(tweets chan Tweet, client *graphql.Client, search string) {
	latestTime := time.Now()
	for {
		time.Sleep(5000 * time.Millisecond)
		newTweets, _ := List(client, search)
		for _, tweet := range newTweets {
			if tweet.PublishedAt.After(latestTime) {
				latestTime = tweet.PublishedAt
				tweets <- tweet
			}
		}
	}
}

func Watch(client *graphql.Client, search string) chan Tweet {
	tweets := make(chan Tweet)
	go watchTweets(tweets, client, search)
	return tweets
}

func Pretty(tweet Tweet) string {
	text := term.Wrap(tweet.Text, 60, 4)
	url := fmt.Sprintf(
		"https://twitter.com/%s/status/%s",
		strings.ReplaceAll(tweet.AuthorName, "@", ""),
		tweet.Id,
	)

	prettyAuthorName := term.Cyan(term.Bold(tweet.AuthorName))
	prettyURL := term.Dimmed(url)
	return fmt.Sprintf("%s (%s)\n%s\n%s\n",
		prettyAuthorName,
		tweet.PublishedAt,
		text,
		prettyURL,
	)
}
