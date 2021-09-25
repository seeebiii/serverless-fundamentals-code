# serverless-fundamentals-code
Example code for my course Serverless Fundamentals.
It providers serverless services to process, store, and retrieve autocomplete data for German cities.

## About

- [autocomplete-api](./autocomplete-api): API stack to get autocomplete suggestions
- [autocomplete-data-store](./autocomplete-data-store): Stack to store the autocomplete data in DynamoDB
- [autocomplete-data-producer](./autocomplete-data-producer): Stack to push the original data from a CSV file to a queue
- [autocomplete-data-worker](./autocomplete-data-worker): Stack to process the CSV data rows from a queue and store it in DynamoDB
- [data](./data): Contains two example data sets for German cities

## Requirements

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed
- Serverless Framework installed: `npm i -g serverless`

## Deploy

You can use [deploy_all.sh](./deploy_all.sh) to deploy all services at once:

```shell
./deploy_all.sh
```

Alternatively, you can manually deploy the services like this:

```shell
cd autocomplete-data-store
sls deploy
```

Repeat that for the other services as well.

## Questions

Do you have any questions or want to book my course?
Just [reach out](mailto:hello@sebastianhesse.de).
