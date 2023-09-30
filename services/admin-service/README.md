# Admin Service

## Introduction
The admin service is a microservice meant to be used by administrators of the application to do privileged actions on Firebase.

Administrators are defined using Firebase custom claims. An app user with the below custom claim is an administrator:
```
{ admin : true }
```

Examples of privileged actions handled by this service include:
* Setting someone as an administrator
* Removing administrator privileges from someone
* Listing out all users that are stored in the application's Firebase Authentication database

Note: 
* As all backend services are assumed to be run within a secure environment, the admin service itself will not verify if the API request comes from an administrator
* For verification of whether the request originates from an administrator, the verification is done by the gateway service.

## How to run the service locally
The command to run at the root of the entire project is as follows:
```
yarn workspace admin-service start
```

This will read in a file named `.env` for environment variables. Therefore, your `.env` file needs this variable set:
```
FIREBASE_SERVICE_ACCOUNT
```

This corresponds to the service account for the project on Firebase itself.

## How to do automated testing
Automated testing is done using a [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite).
The README file at the project root has more details on this. Be sure to read that before trying to run any tests here.

To run the unit tests locally, run this command at the project root:
`yarn workspace admin-service test`

To run the system tests locally, run this command at the project root:
`yarn workspace admin-service systemtest`

You may also run them in CI. In such a case, you need to provide the environment variables manually:
```
yarn workspace admin-service test:ci
yarn workspace admin-service systemtest:ci
```