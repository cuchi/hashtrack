package user

import (
	"context"

	"github.com/Laisky/graphql"
)

type currentUserQuery struct {
	CurrentUser struct {
		Id    graphql.ID
		Email graphql.String
		Name  graphql.String
	}
}

type User struct {
	Name  string
	Email string
}

func GetCurrent(client *graphql.Client) (User, error) {
	var query currentUserQuery
	err := client.Query(context.Background(), &query, nil)

	return User{
		string(query.CurrentUser.Name),
		string(query.CurrentUser.Email),
	}, err
}
