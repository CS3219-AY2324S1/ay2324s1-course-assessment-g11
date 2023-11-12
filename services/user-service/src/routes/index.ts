import express from "express";
const indexRouter = express.Router();

import userDatabaseFunctions from "../db/functions";

indexRouter.post("/", function (req: express.Request, res: express.Response) {
  userDatabaseFunctions
    .createUser(req.body)
    .then((result) => {
      if (result === null) {
        res.status(200).append("Is-User-Already-Found", "true").end();
      } else {
        res.status(201).json(result);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
});

indexRouter.get(
  "/:uid",
  function (req: express.Request, res: express.Response) {
    userDatabaseFunctions
      .getUserByUid(req.params.uid)
      .then((result) => {
        if (result === null) {
          res.status(404).end();
        } else {
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        // Server side error such as database not being available
        console.log(err);
        res.status(500).end();
      });
  }
);

indexRouter.put(
  "/:uid",
  function (req: express.Request, res: express.Response) {
    /**
     * Need to check that header UID was not tampered with.
     *
     * Attack Scenario:
     *   1) User 2 wants to edit profile of user 1.
     *   2) This should be blocked by the gateway since path param uid = 1 and header uid = 1
     *      but user 2 only has authentication token for user 2
     *   3) User 2 could change header uid = 2 to pass authentication, but retain path param uid = 1
     *      to attempt to change user 1's data
     *   4) Hence, need to check that param uid = header uid
     */
    const pathUid = req.params.uid;
    const headerUid = req.get("User-Id");
    if (pathUid !== headerUid) {
      res.status(400).end();
    } else {
      userDatabaseFunctions
        .updateUserByUid(req.params.uid, req.body)
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "P2025") {
            res.status(404).end();
          } else {
            // Server side error such as database not being available
            res.status(500).end();
          }
        });
    }
  }
);

indexRouter.delete(
  "/:uid",
  function (req: express.Request, res: express.Response) {
    /**
     * Need to check that header UID was not tampered with.
     *
     * Attack Scenario:
     *   1) User 2 wants to edit profile of user 1.
     *   2) This should be blocked by the gateway since path param uid = 1 and header uid = 1
     *      but user 2 only has authentication token for user 2
     *   3) User 2 could change header uid = 2 to pass authentication, but retain path param uid = 1
     *      to attempt to change user 1's data
     *   4) Hence, need to check that param uid = header uid
     */
    const pathUid = req.params.uid;
    const headerUid = req.get("User-Id");
    if (pathUid !== headerUid) {
      res.status(400).end();
    } else {
      userDatabaseFunctions
        .deleteUserByUid(req.params.uid)
        .then(() => {
          res.status(204).end();
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "P2025") {
            res.status(404).end();
          } else {
            // Server side error such as database not being available
            res.status(500).end();
          }
        });
    }
  }
);

export default indexRouter;
