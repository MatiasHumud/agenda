module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			res.locals.tipos = ["XS", "S", "M", "L"];
			next();
			break;
		case "Branch":
			res.locals.tipos = ["XS", "S", "M", "L"];
			next();
			break;
		default:
			console.log("Acceso no autorizado");
			res.redirect("/session/servicios");
	}
}