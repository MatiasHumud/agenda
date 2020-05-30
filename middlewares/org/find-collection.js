var User = require("../../models/user.model").User;
//var ownerCheck = require("./document-permission");

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Branch":
			User.find({permission: "Resource", parentBranch: res.locals.user._id})
				.populate("parentBranch")
				.exec(function(err, members){
					if(!err){
						res.locals.staff = members;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});

			break;
		case "Admin":
			User.find({permission: { "$ne": undefined }, _id: { "$ne": res.locals.user._id } })
				.populate("parentBranch")
				.exec(function(err, members){
					if(!err){
						res.locals.staff = members;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});

			break;
		default:
			res.redirect("/session");
	}
}