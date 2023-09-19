import express, {Router} from 'express';
import {removeAdminFromGithubUid, setGithubUidAsAdmin} from "../firebase-admin/firebaseApp";

var router : Router = express.Router();

router.put('/setAdmin/:githubId', function(req : express.Request, res : express.Response) {
  return setGithubUidAsAdmin(req.params.githubId).then((userFound) => {
    if (userFound) {
      res.status(200).json({
        "providerId": req.params.githubId
      });
    } else {
      // User not found
      res.status(404).end();
    }
  }).catch((error) => {
    console.log(error);
    res.status(500).end();
  })
});

router.put('/removeAdmin/:githubId', function(req : express.Request, res : express.Response) {
  return removeAdminFromGithubUid(req.params.githubId).then((userFound) => {
    if (userFound) {
      res.status(200).json({
        "providerId": req.params.githubId
      });
    } else {
      // User not found
      res.status(404).end();
    }
  }).catch((error) => {
    console.log(error);
    res.status(500).end();
  })
});

export default router;
