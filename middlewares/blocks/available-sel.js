var User = require("../../models/user.model").User;
var Service = require("../../models/service").Service;
var Pack = require("../../models/pack").Pack;
//var isEditable = require("./is-editable");

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			User.find({permission: "Branch"}).then(function(brnchs){
				if(brnchs){
					User.find({permission: "Resource"}).then(function(resrcs){
						if(resrcs){
							res.locals.branches = brnchs;
							res.locals.resources = resrcs;
							next();
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
					res.locals.resources = resrcs;
					next();
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
			/*
			res.locals.resources = [res.locals.user];
			next();
			*/
			console.log("Acceso no autorizado");
			res.redirect("/session");
			break;
		default:
			console.log("Acceso no autorizado");
			res.redirect("/session");
	}
}