package tweet

import (
	"context"
	"log"

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

	log.Println(query)
	return []Tweet{}, err
}
