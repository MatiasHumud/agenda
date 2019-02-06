var PackType = require("../../models/packType").PackType;
//var ownerCheck = require("./document-permission");

module.exports = function(req, res, next){
	PackType.findById(req.params.id)
		//.populate("parentBranch")
		.exec(function(err, pckTyp){
			if(pckTyp != null /*&& ownerCheck(doc, req, res)*/){
				res.locals.packType = pckTyp;
				next();
			}
			else{
				res.redirect("/session/packTypes");
			}
		});
}
