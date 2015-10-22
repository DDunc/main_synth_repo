module.exports = function ensureAuthenticated(req, res, next) {
  console.log("ensure auth req", req.user.session);
  if (req.isAuthenticated()) { return next(); }
  console.log("failed auth");
  res.redirect('/');
};
