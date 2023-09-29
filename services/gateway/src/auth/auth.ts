import { promiseVerifyIsLoggedIn, promiseVerifyIsCorrectUser, promiseVerifyIsAdmin } from './firebase';
import express, {Express} from "express";
import {frontend_link} from "../frontend_link/frontend_link";

const redirectLink = frontend_link;

export const setupIsLoggedIn = (app : Express, routes : any[]) => {
  routes.forEach(r => {
    app.use(r.url, function(req : express.Request, res : express.Response, next : express.NextFunction) {
      const idToken = req.get("User-Id-Token");
      if (!idToken) {
        console.log("Redirecting")
        res.redirect(redirectLink)
      } else {
        promiseVerifyIsLoggedIn(idToken as string).then((isLoggedIn) => {
          if (isLoggedIn) {
            console.log("Passing to next function!")
            next();
          } else {
            res.redirect(redirectLink)
          }
        }).catch((error) => {
          console.log(error)
          res.status(500).send("A server-side error occurred! Contact the admin for help.");
        });
      }
    });
  });
}

export const setupUserIdMatch = (app : Express, routes : any[]) => {
  routes.forEach(r => {
    r.user_match_required.forEach((method : string) => {
      applyMiddleware(r.url + "/:uid", method, app,
        function(req : express.Request, res : express.Response, next : express.NextFunction) {
        const idToken = req.get("User-Id-Token");
        const paramUid = req.params.uid;
        if (!idToken || !paramUid) {
          res.redirect(redirectLink)
        } else {
          promiseVerifyIsCorrectUser(idToken as string, paramUid).then((isCorrectUid) => {
            if (isCorrectUid) {
              console.log("Passing to next function!");
              next();
            } else {
              res.redirect(redirectLink);
            }
          }).catch((error) => {
            console.log(error)
            res.status(500).send("A server-side error occurred! Contact the admin for help.");
          });
        }
      });
    });
  });
}

export const setupAdmin = (app : Express, routes : any[]) => {
  // If admin access is required, check that the firebase ID token has an admin claim
  routes.forEach(r => {
    r.admin_required.forEach((method : string) => {
      applyMiddleware(r.url, method, app,
        function(req : express.Request, res : express.Response, next : express.NextFunction) {
        // Pass in the user as a header of the request
        const idToken = req.get("User-Id-Token");
        if (!idToken) {
          res.redirect(redirectLink);
        } else {
          promiseVerifyIsAdmin(idToken as string).then((isAdmin) => {
            if (isAdmin) {
              console.log("Passing to next function!");
              next();
            } else {
              res.status(403).send("You are not admin.");
            }
          }).catch((error) => {
            console.log(error);
            res.status(500).send("A server-side error occurred! Contact the admin for help.");
          })
        }
      })
    });
  })
};

const applyMiddleware = (url : string, method : string, app : Express, func : any) => {
  switch(method) {
    case "GET":
      app.get(url, func);
      break;
    case "POST":
      app.post(url, func);
      break;
    case "PUT":
      app.put(url, func);
      break;
    case "DELETE":
      app.delete(url, func)
  }
}
