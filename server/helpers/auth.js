let authorized = false;

module.exports.authCheck = (req, res, next) => {
  if (authorized) {
    next();
  } else {
    throw new Error("Unauthorized");
  }
};
