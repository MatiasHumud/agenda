var Documento = require("../../models/contract.model").Documento;
var ownerCheck = require("../document-permission");

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Resource":
			Documento.find({recurso: res.locals.user._id, title: "block"})
				.populate("usuario")
				.populate("recurso")
				.populate("sucursal")
				.populate("servicio")
				.exec(function(err, docs){
					if(!err){
						res.locals.documentos = docs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});

			break;
		case "Branch":
			Documento.find({sucursal: res.locals.user._id, title: "block"})
				.populate("usuario")
				.populate("recurso")
				.populate("sucursal")
				.populate("servicio")
				.exec(function(err, docs){
					if(!err){
						res.locals.documentos = docs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});

			break;
		case "Admin":
			Documento.find({title: "block"})
				.populate("usuario")
				.populate("recurso")
				.populate("sucursal")
				.populate("servicio")
				.exec(function(err, docs){
					if(!err){
						res.locals.documentos = docs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});

			break;
		default:
			Documento.find({usuario: res.locals.user._id, title: "block"})
				.populate("usuario")
				.populate("recurso")
				.populate("sucursal")
				.populate("servicio")
				.exec(function(err, docs){
					if(!err){
						res.locals.documentos = docs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});
	}
}