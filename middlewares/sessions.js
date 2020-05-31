var User = require("../models/user.model").User;

module.exports = async function(req, res, next){
  try {
    const user = await User.findOne({ userId: req.session.userId });
		res.locals.user = user;
		next();
  } catch (error) {
    console.log({ error });
    res.redirect("/");
  }
}