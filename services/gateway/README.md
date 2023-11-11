# Gateway

## API Route Proxy
Much of the proxy functionality was adapted from [this tutorial](https://medium.com/geekculture/create-an-api-gateway-using-nodejs-and-express-933d1ca23322
).

The below code shows a sample route that is being proxied from the frontend to the backend through the gateway:
```
{
    url: "/api/user-service",
    admin_required_methods: [], // Empty, so no admin verification is done for all methods to the user-service
    user_match_required_methods: ["PUT", "DELETE"],
    // PUT and DELETE require checking that the user is only updating/deleting their own data
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5,
    },
    proxy: {
      target: userServiceAddress,
      changeOrigin: true,
    },
},
```

This code is part of the `http_proxied_routes` list in `src/proxied_routes/proxied_routes.ts` file.

Explanation:
* `url` - The initial path. Assuming that the gateway address is `YYY://localhost:4000`, the frontend would call `YYY://localhost:4000/api/user-service`
* `admin_required_methods` - a list of methods in which admin role is required to access the resource
* `user_match_required_methods` - a list of methods in which the `uid` in the `"User-Id"` header of the request must be checked against the current user in Firebase
* `rateLimit` - currently unused. May be removed if not needed
* `proxy` - an object for routing the request to the user service. The underlying dependency used is [`http-proxy-middleware`](https://github.com/chimurai/http-proxy-middleware)

### Required headers
The required headers are as follows:
* `User-Id-Token` - the id token obtained by calling [`getIdToken()` on the current Firebase user](https://firebase.google.com/docs/reference/js/v8/firebase.User#getidtoken)
* `User-Id` - if user matching is done, the `uid` for which the request is being made to. Usually, requests requiring
the `uid` check will have the `uid` in the path param. So the `uid` value in `User-Id` and the path param must be the same.


## Required environment variables
The Gateway requires the following environment variables:

| Environment variable file                            | File location | Environment Variable Name | Explanation                                                                                                               |
|------------------------------------------------------| --- | --- |---------------------------------------------------------------------------------------------------------------------------|
| `.env`                                               | Project root | `FIREBASE_SERVICE_ACCOUNT` | The service account corresponding to the app on Firebase. This is needed for API calls.                                   |
| `.env.development.local` (already in source control) | Project root | `ENVIRONMENT_TYPE` | Set this to `local-dev` for `localhost` testing. In other environments like Docker and Kubernetes, this file is not read. |


## Local development and testing of the Gateway
Steps:
1) Add an `.env` file at the project root with the above-mentioned variable at the project root.
2) At the project root, run `yarn workspace gateway dev:local`
