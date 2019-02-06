var User = require("../../models/user").User;
//var ownerCheck = require("./document-permission");

module.exports = function(req, res, next){
	User.findById(req.params.id)
		//.populate("parentBranch")
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
