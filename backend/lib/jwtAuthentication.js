const passport = require("passport");

const jwtAuthentication = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json(info);
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = jwtAuthentication;
