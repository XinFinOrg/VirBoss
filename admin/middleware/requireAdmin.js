// all the admins have equal rights
const db = require("../../database/models");
const client = db.client;
module.exports = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const currUser = await client.findOne({
        where: { email: req.user.email }
      });
      if (currUser === null) {
        return res.redirect("/");
      }
      if (currUser.acntType === 1) {
        next();
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  } catch (e) {
    console.log("exception at  admin.middleware.requireAdmin: ", e);
    res.redirect("/");
  }
};
