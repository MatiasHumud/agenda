var Service = require("../../models/service").Service;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Branch":
			Service.find({})
				//.populate("parentBranch") (#*#)
				.exec(function(err, svcs){
					if(!err){
						res.locals.services = svcs;
						next();			
					}
					else{
						res.redirect("/session/servicios");	
					}
				});
			break;
	//En caso de querer tener distintos servicios por sucursal... (#*#)
		case "Admin":
			Service.find({})
				//.populate("parentBranch") (#*#)
				.exec(function(err, svcs){
					if(!err){
						res.locals.services = svcs;
						next();			
					}
					else{
						res.redirect("/session/servicios");	
					}
				});
			break;
		default:
			res.redirect("/session");
	}
}