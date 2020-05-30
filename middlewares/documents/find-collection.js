var Documento = require("../../models/contract.model").Documento;
var User = require("../../models/user.model").User;
var ownerCheck = require("../document-permission");

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			User.find({permission: "Branch"}).then(function(brnchs){
				if(brnchs){
					User.find({permission: "Resource"}).then(function(resrcs){
						if(resrcs){
							Documento.find({title: "default"})
								.populate("usuario")
								.populate("recurso")
								.populate("sucursal")
								.populate("servicio")
								.exec(function(err, docs){
									if(!err){
										res.locals.branches = brnchs;
										res.locals.resources = resrcs;
										res.locals.documentos = docs;
										next();			
									}
									else{
										res.redirect("/session");	
									}
								});
						}
						else{
							console.log("No se encontraron kinesiólogos");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar kinesiólogos en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron sucursales");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar sucursales en base de datos");
				res.redirect("/session");
			});
			break;
		case "Branch":
			User.find({permission: "Resource", parentBranch: res.locals.user._id}).then(function(resrcs){
				if(resrcs){
					Documento.find({sucursal: res.locals.user._id, title: "default"})
						.populate("usuario")
						.populate("recurso")
						.populate("sucursal")
						.populate("servicio")
						.exec(function(err, docs){
							if(!err){
								res.locals.branches = undefined;
								res.locals.resources = resrcs;
								res.locals.documentos = docs;
								next();			
							}
							else{
								res.redirect("/session");	
							}
						});
				}
				else{
					console.log("No se encontraron kinesiólogos");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar kinesiólogos en base de datos");
				res.redirect("/session");
			});
			break;
		case "Resource":
			Documento.find({recurso: res.locals.user._id, title: "default"})
				.populate("usuario")
				.populate("recurso")
				.populate("sucursal")
				.populate("servicio")
				.exec(function(err, docs){
					if(!err){
						res.locals.branches = undefined;
						res.locals.resources = [res.locals.user];
						res.locals.documentos = docs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});
			break;
		default:
			Documento.find({usuario: res.locals.user._id, title: "default"})
				.populate("usuario")
				.populate("recurso")
				.populate("sucursal")
				.populate("servicio")
				.exec(function(err, docs){
					if(!err){
						res.locals.branches = undefined;
						res.locals.resources = undefined;
						res.locals.documentos = docs;
						next();			
					}
					else{
						res.redirect("/session");	
					}
				});
	}
}
