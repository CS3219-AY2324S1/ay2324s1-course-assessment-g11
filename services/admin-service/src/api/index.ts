import express, {Router} from 'express';
import {listAllFirebaseUsers, removeAdminFromFirebaseUid, setFirebaseUidAsAdmin} from "../firebase-server/firebaseApp";

var router : Router = express.Router();

router.get('/', function(req : express.Request, res : express.Response) {
  // Extract the next page token
  const nextPageToken = req.get('Next-Page-Token');
  listAllFirebaseUsers(nextPageToken).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    console.log(error);
    res.status(500).end();
  })
});

router.put('/setAdmin/:uid', function(req : express.Request, res : express.Response) {
  setFirebaseUidAsAdmin(req.params.uid).then((userFound) => {
    if (userFound) {
      res.status(200).json({
        "providerId": req.params.uid
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

router.put('/removeAdmin/:uid', function(req : express.Request, res : express.Response) {
  removeAdminFromFirebaseUid(req.params.uid).then((userFound) => {
    if (userFound) {
      res.status(200).json({
        "providerId": req.params.uid
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
