var User = require("../models/user.model").User;

module.exports = function(req, res, next){
	if(!req.session.user_id){
		res.redirect("/");
	}
	else{
		User.findById(req.session.user_id)
			.populate("parentBranch")
			.exec(function(err, usr){
			if(err){
				console.log(err);
				res.redirect("/");
			}
			else{
				res.locals.user = usr;
				next();
			}
		});
	}
}