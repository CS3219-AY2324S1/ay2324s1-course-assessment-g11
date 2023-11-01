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
      .catch(() => {
        // Server side error such as database not being available
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
          if (error.code === "P2025") {
            res.status(404).end();
          } else {
            // Server side error such as database not being available
            res.status(500).end();
          }
        })
    }
  }
);

indexRouter.get(
  "/:uid/attempts",
  function (req: express.Request, res: express.Response) {
    userDatabaseFunctions
      .getAttemptsOfUser(req.params.uid)
      .then((result) => {
        if (result === null) {
          // res.status(404).end();
          res.send(200).json([]);
        } else {
          res.status(200).json(result);
        }
      })
      .catch(() => {
        // Server side error such as database not being available
        res.status(500).end();
      });
  }
);

indexRouter.get(
  "/attempt/:attempt_id",
  function (req: express.Request, res: express.Response) {
    userDatabaseFunctions
      .getAttemptById(req.params.attempt_id)
      .then((result) => {
        if (result === null) {
          res.status(404).end();
        } else {
          res.status(200).json(result);
        }
      })
      .catch(() => {
        // Server side error such as database not being available
        res.status(500).end();
      });
  }
);

indexRouter.post(
  "/attempt",
  function (req: express.Request, res: express.Response) {
    const uid = req.body.uid as string;
    const question_id = req.body.question_id as string;
    const answer = req.body.answer as string;
    const solved = (req.body.solved as boolean) ?? false;
    userDatabaseFunctions
      .createAttemptOfUser(req.body)
      .then((result) => {
        if (result === null) {
          res.status(404).append("No-Such-User", "true").end();
        } else {
          res.status(201).json(result);
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  }
);

export default indexRouter;
