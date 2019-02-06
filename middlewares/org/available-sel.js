module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			/*User.find({permission: "Branch"}).then(function(brnchs){
				if(brnchs){
					res.locals.sucursales = brnchs;
					res.locals.permisos = ["Admin", "Branch", "Resource"];
					next();
				}
				else{
					console.log("No se encontraron sucursales");
					res.redirect("/session/org");
				}
			},function(err){
				console.log(String(err));
				console.log("Error al buscar sucursales en base de datos");
				res.redirect("/session/org");
			});*/
			res.locals.permisos = ["Admin", "Branch"];
			next();
			break;
		case "Branch":
			//res.locals.sucursales = [res.locals.user];
			res.locals.permisos = ["Resource"];
			next();
			break;
		default:
			console.log("Acceso no autorizado");
			res.redirect("/session/org");
	}
}