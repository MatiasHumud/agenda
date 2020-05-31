var User = require("../../models/user.model").User;

module.exports = function(req, res, next){
	console.log(`find-collection-middleware ${res.locals.user.userType}`)
}
