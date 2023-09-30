import express, {Router} from 'express';
import firebaseWrappers from "../firebase-server/firebaseWrappers";

var router : Router = express.Router();

router.get('/listUsers', function(req : express.Request, res : express.Response) {
  // Extract the next page token
  const nextPageToken = req.get('Next-Page-Token');
  firebaseWrappers.listAllFirebaseUsers(nextPageToken).then((result) => {
    res.status(200).json(result);
  }).catch((error) => {
    console.log(error);
    res.status(500).end();
  })
});

router.put('/setAdmin/:uid', function(req : express.Request, res : express.Response) {
  firebaseWrappers.setFirebaseUidAsAdmin(req.params.uid).then((userFound) => {
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
  firebaseWrappers.removeAdminFromFirebaseUid(req.params.uid).then((userFound) => {
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
