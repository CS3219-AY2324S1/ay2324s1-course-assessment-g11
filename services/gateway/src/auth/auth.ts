import { promiseVerifyIsLoggedIn, promiseVerifyIsCorrectUser, promiseVerifyIsAdmin } from './firebase';
import express, {Express} from "express";
import {frontendAddress} from "../proxied_routes/service_names";

const redirectLink = frontendAddress;
const userIdTokenHeader = "User-Id-Token";

export const setupIsLoggedIn = (app : Express, routes : any[]) => {
  routes.forEach(r => {
    app.use(r.url, function(req : express.Request, res : express.Response, next : express.NextFunction) {
      const idToken = req.get(userIdTokenHeader);
      if (!idToken) {
        res.redirect(redirectLink);
      } else {
        promiseVerifyIsLoggedIn(idToken as string).then((isLoggedIn) => {
          if (isLoggedIn) {
            next();
          } else {
            res.redirect(redirectLink)
          }
        }).catch((error) => {
          console.error(error);
          res.status(500).send("A server-side error occurred! Contact the admin for help.");
        });
      }
    });
  });
}

export const setupUserIdMatch = (app : Express, routes : any[]) => {
  routes.forEach(r => {
    app.use(r.url, function(req : express.Request, res : express.Response, next : express.NextFunction) {
      if (r.user_match_required_methods.includes(req.method)) {
        const idToken = req.get(userIdTokenHeader);
        const paramUid = req.params.uid;
        if (!idToken || !paramUid) {
          res.redirect(redirectLink)
        } else {
          promiseVerifyIsCorrectUser(idToken as string, paramUid).then((isCorrectUid) => {
            if (isCorrectUid) {
              next();
            } else {
              res.redirect(redirectLink);
            }
          }).catch((error) => {
            console.error(error);
            res.status(500).send("A server-side error occurred! Contact the admin for help.");
          });
        }
      } else {
        // Skip
        next();
      }
    });
  });
}

export const setupAdmin = (app : Express, routes : any[]) => {
  // If admin access is required, check that the firebase ID token has an admin claim
  routes.forEach(r => {
    app.use(r.url, function(req : express.Request, res : express.Response, next : express.NextFunction) {
      if (r.admin_required_methods.includes(req.method)) {
        // Pass in the user as a header of the request
        const idToken = req.get(userIdTokenHeader);
        if (!idToken) {
          res.redirect(redirectLink);
        } else {
          promiseVerifyIsAdmin(idToken as string).then((isAdmin) => {
            if (isAdmin) {
              next();
            } else {
              res.status(403).send("You are not admin.");
            }
          }).catch((error) => {
            console.error(error);
            res.status(500).send("A server-side error occurred! Contact the admin for help.");
          })
        }
      } else {
        // Skip
        next();
      }
    });
  });
};
