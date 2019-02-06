var Documento = require("../../models/documento").Documento;
var ownerCheck = require("../document-permission");

module.exports = function(req, res, next){
	Documento.findById(req.params.id)
		.populate("usuario")
		.populate("recurso")
		.populate("sucursal")
		.populate("servicio")
		.exec(function(err, doc){
			if(doc != null /*&& ownerCheck(doc, req, res)*/){
				res.locals.documento = doc;
				next();
			}
			else{
				res.redirect("/session");
			}
	});
}
