package main

import (
	"context"
	"fmt"
	"log"

	"hashtrack/login"

	"github.com/shurcooL/graphql"
)

type user = struct {
	User struct {
		Id        graphql.String
		Firstname graphql.String
		Age       graphql.Float
	} `graphql:"user(id: $id)"`
}

func main() {
	client := graphql.NewClient(
		"https://hashtrack.herokuapp.com/graphql",
		nil,
	)

	var query user
	variables := map[string]interface{}{
		"id": graphql.ID("1"),
	}

	login.Login()

	err := client.Query(context.Background(), &query, variables)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(query.User.Firstname)

}
