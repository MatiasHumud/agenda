var Service = require("../../models/service").Service;
//var ownerCheck = require("./document-permission");

module.exports = function(req, res, next){
	Service.findById(req.params.id)
		//.populate("parentBranch")
		.exec(function(err, svc){
			if(svc != null /*&& ownerCheck(doc, req, res)*/){
				res.locals.service = svc;
				next();
			}
			else{
				res.redirect("/session/servicios");
			}
		});
}
