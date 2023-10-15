import express from "express";
const indexRouter = express.Router();

import userDatabaseFunctions from "../db/functions";

indexRouter.post("/", function (req: express.Request, res: express.Response) {
  userDatabaseFunctions
    .createUser(req.body)
    .then((result) => {
      if (result === null) {
        res.status(400).append("Is-User-Already-Found", "true").end();
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
);

indexRouter.delete(
  "/:uid",
  function (req: express.Request, res: express.Response) {
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
      });
  }
);

indexRouter.get(
  "/:uid/attempts",
  function (req: express.Request, res: express.Response) {
    userDatabaseFunctions
      .getAttemptsOfUser(req.params.uid)
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
  "/:uid/attempt",
  function (req: express.Request, res: express.Response) {
    userDatabaseFunctions
      .createAttemptOfUser(req.params.uid, req.body)
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
