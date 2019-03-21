module.exports = function(req, res, next){
	switch(res.locals.user.permission){
		case "Admin":
			res.locals.tipos = ["XS", "S", "M", "L"];
			res.locals.genders = ["H", "M"];
			res.locals.positions = ["Frente", "Espalda"]
			next();
			break;
		default:
			console.log("Acceso no autorizado");
			res.redirect("/session/servicios");
	}
}
