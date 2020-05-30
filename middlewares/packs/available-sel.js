var User = require("../../models/user.model").User;
var PackType = require("../../models/packType").PackType;
//var isEditable = require("./is-editable");

module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			User.find({permission: undefined}).then(function(usrs){
				if(usrs){
					PackType.find({isAvailable: true}).then(function(pTyp){
						if(pTyp){
							res.locals.users = usrs;
							res.locals.packTypes = pTyp;
							next();
						}
						else{
							console.log("No se encontraron packTypes");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar packTypes en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case "Resource":
			User.find({permission: undefined}).then(function(usrs){
				if(usrs){
					PackType.find({isAvailable: true}).then(function(pTyp){
						if(pTyp){
							res.locals.users = usrs;
							res.locals.packTypes = pTyp;
							next();
						}
						else{
							console.log("No se encontraron packTypes");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar packTypes en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case "Branch":
			User.find({permission: undefined}).then(function(usrs){
				if(usrs){
					PackType.find({isAvailable: true}).then(function(pTyp){
						if(pTyp){
							res.locals.users = usrs;
							res.locals.packTypes = pTyp;
							next();
						}
						else{
							console.log("No se encontraron packTypes");
							res.redirect("/session");
						}
					},function(err){
						console.log(String(err));
						console.log("Error al buscar packTypes en base de datos");
						res.redirect("/session");
					});
				}
				else{
					console.log("No se encontraron usuarios");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		default:
			PackType.find({ isAvailable: true }).then(function(pTyp){
				if(pTyp){
					res.locals.users = [res.locals.user];
					res.locals.packTypes = pTyp;
					next();
				}
				else{
					console.log("No se encontraron packTypes");
					res.redirect("/session");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar packTypes en base de datos");
				res.redirect("/session");
			});
	}
}