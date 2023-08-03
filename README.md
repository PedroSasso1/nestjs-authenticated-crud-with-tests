## Introduction
This is a REST API for expenses authenticated by jwt, this app also holds a mailer service that uses Amazon SES

## Documentation

Published API: https://documenter.getpostman.com/view/26232812/2s9XxwwuF8
There is also a postman json collection on root folder

## Installation

```bash
$ npm install
```

## Configuring

1. You will to fill your .env file

SES_SOURCE must be an authenticated ses source for sending emails in aws

```
JWT_SECRET=
AWS_REGION=
SES_SOURCE=
```
2. Then you will need to configure AWS CLI

Your CLI need to have permissions for sending emails with SES


```bash
aws configure
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
