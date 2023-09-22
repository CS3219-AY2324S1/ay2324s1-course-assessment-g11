import { promiseVerifyIsLoggedIn, promiseVerifyIsCorrectUser, promiseVerifyIsAdmin } from './firebase';
import {Express} from "express";

const redirectLink = "http://localhost:3000";

export const setupIsLoggedIn = (app : Express, routes : any[]) => {
  routes.forEach(r => {
    app.use(r.url, function(req, res, next) {
      const idToken = req.get("User-Id-Token");
      if (!idToken) {
        res.redirect(redirectLink)
      }

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
    });
  });
}

export const setupUserIdMatch = (app : Express, routes : any[]) => {
  routes.forEach(r => {
    if (r.user_match_required) {
      app.use(r.url + "/:uid", function(req, res, next) {
        const idToken = req.get("User-Id-Token");
        const paramUid = req.params.uid;
        if (!idToken || !paramUid) {
          res.redirect(redirectLink)
        }

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
      });
    }
  });
}

export const setupAdmin = (app : Express, routes : any[]) => {
  // If admin access is required, check that the firebase ID token has an admin claim
  routes.forEach(r => {
    if (r.admin_required) {
      app.use(r.url, function (req, res, next) {
        // Pass in the user as a header of the request
        const idToken = req.get("User-Id-Token");
        if (!idToken) {
          res.redirect(redirectLink);
        }

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
      });
    }
  });
}
