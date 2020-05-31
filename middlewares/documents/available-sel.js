var User = require("../../models/user.model").User;

module.exports = function(req, res, next){
	switch(res.locals.user.userType){
		case 'Admin':
			User.find({permission: undefined}).then(function(usrs){
				console.log('Admin middleware');
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case 'Benefactor':
			User.find({permission: undefined}).then(function(usrs){
				console.log('Benefactor middleware');
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		case 'Beneficiary':
			User.find({permission: undefined}).then(function(usrs){
				console.log('Beneficiary middleware');
			},function(err){
				console.log(String(err));
				console.log("Error al buscar usuarios en base de datos");
				res.redirect("/session");
			});
			break;
		default:
			console.log('Should have permission');
			res.redirect("/session");
	}
}
