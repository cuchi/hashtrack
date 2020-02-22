package session

import (
	"context"

	"github.com/Laisky/graphql"
)

type creationMutation = struct {
	CreateSession struct {
		Token graphql.String
	} `graphql:"createSession(email: $email, password: $password)"`
}

type CreationPayload = struct {
	Email    string
	Password string
}

func Create(client *graphql.Client, payload CreationPayload) (string, error) {
	var mutation creationMutation
	variables := map[string]interface{}{
		"email":    graphql.String(payload.Email),
		"password": graphql.String(payload.Password),
	}
	err := client.Mutate(context.Background(), &mutation, variables)

	return string(mutation.CreateSession.Token), err
}
