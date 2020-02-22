package tweet

import (
	"context"
	"errors"
	"fmt"
	"hashtrack/term"
	"strings"

	"github.com/Laisky/graphql"
)

type Tweet struct {
	Id          string
	PublishedAt string
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

		newTweet := Tweet{
			AuthorName:  string(tweet.AuthorName),
			Text:        string(tweet.Text),
			PublishedAt: string(tweet.PublishedAt),
			Id:          id,
		}

		tweets = append([]Tweet{newTweet}, tweets...)
	}
	return tweets, err
}

func Pretty(tweet Tweet) string {
	text := strings.ReplaceAll(tweet.Text, "\n", "")
	url := fmt.Sprintf(
		"https://twitter.com/%s/status/%s",
		strings.ReplaceAll(tweet.AuthorName, "@", ""),
		tweet.Id,
	)

	prettyAuthorName := term.Cyan(term.Bold(tweet.AuthorName))
	prettyURL := term.Dimmed(url)
	return fmt.Sprintf("%s (%s)\n %s\n%s\n",
		prettyAuthorName,
		tweet.PublishedAt,
		text,
		prettyURL,
	)
}
