var User = require("../../models/user.model").User;
//var ownerCheck = require("./document-permission");

module.exports = function(req, res, next){
	User.findOne({ userId: req.params.userId })
		.exec(function(err, member){
			if(member != null /*&& ownerCheck(doc, req, res)*/){
				res.locals.member = member;
				next();
			}
			else{
				res.redirect("/session/org");
			}
		});
}
