package tracks

import (
	"context"
	"errors"
	"fmt"
	"hashtrack/term"
	"time"

	"github.com/Laisky/graphql"
)

type Track struct {
	HashtagName string
	PrettyName  string
	CreatedAt   time.Time
}

type listQuery struct {
	Tracks []struct {
		HashtagName graphql.ID
		PrettyName  graphql.String
		CreatedAt   graphql.String
	}
}

type removalMutation struct {
	RemoveTrack struct {
		HashtagName graphql.ID
	} `graphql:"removeTrack(hashtag: $hashtagName)"`
}

type creationMutation struct {
	CreateTrack struct {
		HashtagName graphql.ID
	} `graphql:"createTrack(hashtag: $hashtagName)"`
}

func List(client *graphql.Client) ([]Track, error) {
	var query listQuery
	err := client.Query(context.Background(), &query, nil)
	tracks := []Track{}

	if err != nil {
		return tracks, err
	}

	for _, track := range query.Tracks {
		hashtagName, ok := track.HashtagName.(string)
		if !ok {
			return tracks, errors.New(
				"Expected a string when parsing the hashtag name",
			)
		}
		createdAt, err := time.Parse(time.RFC3339, string(track.CreatedAt))
		if err != nil {
			return tracks, err
		}
		tracks = append(tracks, Track{
			HashtagName: "#" + hashtagName,
			PrettyName:  string(track.PrettyName),
			CreatedAt:   createdAt,
		})
	}

	return tracks, nil
}

func Remove(client *graphql.Client, hashtagName string) error {
	var mutation removalMutation
	variables := map[string]interface{}{
		"hashtagName": graphql.String(hashtagName),
	}
	return client.Mutate(context.Background(), &mutation, variables)
}

func Create(client *graphql.Client, hashtagName string) error {
	var mutation creationMutation
	variables := map[string]interface{}{
		"hashtagName": graphql.String(hashtagName),
	}
	return client.Mutate(context.Background(), &mutation, variables)
}

func Pretty(track Track) string {
	if track.HashtagName != track.PrettyName {
		return fmt.Sprintf(
			"%s (%s) %s",
			term.Bold(term.Cyan(track.HashtagName)),
			track.PrettyName,
			term.Dimmed(fmt.Sprintf("created at %s", track.CreatedAt)),
		)
	}
	return fmt.Sprintf(
		"%s %s",
		term.Bold(term.Cyan(track.HashtagName)),
		term.Dimmed(fmt.Sprintf("created at %s", track.CreatedAt)),
	)
}
