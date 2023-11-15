import { promiseVerifyIsLoggedIn, promiseVerifyIsCorrectUser } from './firebase';
import express from "express";

const userIdTokenHeader = "User-Id-Token";
const userIdHeader = "User-Id";

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

export const setupUserIdMatch = (req : express.Request, res : express.Response, next : express.NextFunction) => {
  if (req.method == "PUT" || req.method === "DELETE") {
    const idToken = req.get(userIdTokenHeader);
    const paramUid = req.get(userIdHeader);
    if (!idToken || !paramUid) {
      res.status(403).send("You are not logged in or have an otherwise improperly formatting request");
    } else {
      promiseVerifyIsCorrectUser(idToken as string, paramUid).then((isCorrectUid) => {
        if (isCorrectUid) {
          next();
        } else {
          res.status(403).send("You are trying to update some user other than your own.");
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
};
