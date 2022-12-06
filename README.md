# dynamodb-financial-transactions-sample

AWS Black Belt - Database - Challenge 2022

## Requirements

- Node 16.x
- AWS Account
- Postman Account

## ER Diagram

![alt text](/images/ER.jpg)

## Architecture

![alt text](/images/architecture.jpg)

## AWS Deploy

- Put AWS credentials on your PC
- Install packages: `npm install`
- Deploy on AWS: `npx sls deploy`
- Finally, you'll see something like this:

```
api keys:
  dynamodb-financial-transactions: 8bz1eYCa0Z1secretsecretsecretI9q3P0cvHlm
endpoints:
  ANY - https://examplesvb.execute-api.us-east-1.amazonaws.com/prod/{proxy+}
  load-data: https://cfm2vj5kexampleexamplejham0uejrz.lambda-url.us-east-1.on.aws/
functions:
  ws: dynamodb-financial-transactions-prod-ws (1.7 MB)
  load-data: dynamodb-financial-transactions-prod-load-data (1.4 MB)
```

## Configuring Postman Collection

- Download collection json from [here](https://raw.githubusercontent.com/kazluBR/dynamodb-financial-transactions-sample/master/collection/financial-transactions.postman_collection.json)
- Import this collection on your Postman
- Fill in the variables with their respective values:
  ![alt text](/images/variables-postman-collection.png)
- Now you can run all the endpoints
