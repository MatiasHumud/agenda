var User = require("../models/user.model").User;

module.exports = async function(req, res, next){
  try {
    const user = await User.findOne({ userId: req.session.userId });
    if(!user) {
      throw new Error('User not fount for given id so session could not be started');
    }

		res.locals.user = user;
		next();
  } catch (error) {
    console.log({ error });
    res.redirect("/");
  }
}