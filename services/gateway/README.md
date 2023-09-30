# Gateway

## API Route Proxy
Much of the proxy functionality was adapted from [this tutorial](https://medium.com/geekculture/create-an-api-gateway-using-nodejs-and-express-933d1ca23322
).

The below code shows a sample route that is being proxied from the frontend to the backend through the gateway:
```
{
    url: '/users',
    admin_required_methods: [], // Empty, so no admin verification is done for all methods to the user-service
    user_match_required_methods: ["PUT", "DELETE"],
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5
    },
    proxy: {
      target: "http://localhost:5001/",
      changeOrigin: true,
      pathRewrite: {
        [`^/users`]: '',
      },
    }
  }
```

This code is part of the `proxied_routes` list in `src/proxied_routes/proxied_routes.ts` file.

Explanation:
* `url` - The initial path. Assuming that the gateway address is `YYY://localhost:4000`, the frontend would call `YYY://localhost:4000/users`
* `admin_required_methods` - a list of methods in which admin role is required to access the resource
* `user_match_required_methods` - a list of methods in which the `uid` in the URL path param must be checked against the current user in Firebase
* `rateLimit` - currently unused. May be removed if not needed
* `proxy` - an object for routing the request to the user service. The underlying dependency used is `http-proxy-middleware`

## Events API
Besides proxying requests, the gateway service also serves as the emitter for events from the frontend.

### Example
 
1) The gateway is initialised first. All other backend services connect to the gateway upon startup to join rooms.
2) Suppose that a user logs into the app on the frontend
3) The log in functionality will make a HTTP call to the gateway at the `/events/userLoggedIn` route
4) This route will emit an event to the room
5) The backend service that is subscribed to the room can consume the event

## Required environment variables
The Gateway requires a `FIREBASE_SERVICE_ACCOUNT` environment variable.

## Local testing of the Gateway
Steps:
1) Add an `.env` file at the project root with the above-mentioned variable
2) At the project root, run `yarn workspace gateway start`
