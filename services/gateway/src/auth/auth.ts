import { promiseVerifyIsLoggedIn, promiseVerifyIsCorrectUser, promiseVerifyIsAdmin } from './firebase';

const redirectLink = "http://localhost:3000";

export const setupIsLoggedIn = (app, routes) => {
  routes.forEach(r => {
    app.use(r.url, function(req, res, next) {
      const idToken = req.get("User-Id-Token");
      if (!idToken) {
        res.redirect(redirectLink)
      }

      promiseVerifyIsLoggedIn(idToken).then(() => {
        console.log("Passing to next function!")
        next();
      }).catch((error) => {
        console.log(error)
        res.redirect(redirectLink)
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

        promiseVerifyIsCorrectUser(idToken, paramUid).then(() => {
          console.log("Passing to next function!")
          next();
        }).catch((error) => {
          console.log(error)
          res.redirect(redirectLink)
        });
      });
    }
  });
}

export const setupAdmin = (app, routes) => {
  // If admin access is required, check that the firebase ID token has an admin claim
  routes.forEach(r => {
    if (r.admin_required) {
      app.use(r.url, function (req, res, next) {
        // Pass in the user as a header of the request
        const idToken = req.get("User-Id-Token");
        if (!idToken) {
          res.redirect(redirectLink);
        }

        promiseVerifyIsAdmin(idToken).then(() => {
          next();
        }).catch((error) => {
          res.status(403).send({error});
        })
      });
    }
  });
}
