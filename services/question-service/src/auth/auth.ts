import { promiseVerifyIsLoggedIn, promiseVerifyIsAdmin } from './firebase';
import express from "express";

const userIdTokenHeader = "User-Id-Token";

export const setupIsLoggedIn = (req : express.Request, res : express.Response, next : express.NextFunction) => {
  const idToken = req.get(userIdTokenHeader);
  if (!idToken) {
    res.status(403).send("You are not logged in.");
  } else {
    promiseVerifyIsLoggedIn(idToken as string).then((uid) => {
      if (uid) {
        req.headers["user-id"] = uid;
        next();
      } else {
        res.status(403).send("You are not logged in.");
      }
    }).catch((error) => {
      console.error(error);
      res.status(500).send("A server-side error occurred! Contact the admin for help.");
    });
  }
};

export const setupAdmin = (req : express.Request, res : express.Response, next : express.NextFunction) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
    // Pass in the user as a header of the request
    const idToken = req.get(userIdTokenHeader);
    if (!idToken) {
      res.status(403).send("You are not logged in.");
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
};
