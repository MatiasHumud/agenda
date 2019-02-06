var PackType = require("../../models/packType").PackType;

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":			
			PackType.find({})
				.exec(function(err, docs){
					if(!err){
						res.locals.packTypes = docs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});

			break;
		default:
			Console.locals("Pack Type no autorizado a "+res.locals.user.permission);
			res.redirect("/session");
	}
}