package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

/*
{
    "version": "0",
    "bucket": {
        "name": "vtypeio-source-bucket"
    },
    "object": {
        "key": "1616013057-stax-campaign.jpeg",
        "size": 103396,
        "etag": "beaebed2c657780f9b7559aeb0775951",
        "sequencer": "0061DAF08AAB205BE6"
    },
    "request-id": "FT3WNP1FB8Q6J7H5",
    "requester": "204961252708",
    "source-ip-address": "99.11.93.26",
    "reason": "PutObject"
}
*/

type HandlerFn func(context.Context, events.CloudWatchEvent) error

func Handler() HandlerFn {
	return func(ctx context.Context, e events.CloudWatchEvent) error {
		s, err := e.Detail.MarshalJSON()
		if err != nil {
			return err
		}
		log.Println(string(s))
		return nil
	}
}

func main() {
	lambda.Start(Handler())
}
