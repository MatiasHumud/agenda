var express = require("express");
var User = require("../../models/user.model").User;
var router = express.Router();
var redis = require("redis");

var client = redis.createClient();

router.get("/", function(req, res){
	res.render("session/home");
});

router.get("/account/edit", function(req, res){
	res.render("session/account/edit");
});

router.route("/account")
	.get(function(req, res) {
		res.render("session/account/show", {user: res.locals.user});
	})
	.put(function(req, res){
		if(res.locals.user.password === req.body.oldPassword){
			if(req.body.name) res.locals.user.name = req.body.name;
			if(req.body.lastName) res.locals.user.lastName = req.body.lastName;
			if(req.body.email) res.locals.user.email = req.body.email;
			if(req.body.gender) res.locals.user.gender = req.body.gender;
			if(req.body.newPassword && req.body.password_confirmation) {
				res.locals.user.password = req.body.newPassword;
				res.locals.user.pass_confirm = req.body.password_confirmation;
			}
			if(req.body.whSelect) res.locals.user.workHours = JSON.parse(req.body.whSelect);
			if(req.body.addr) res.locals.user.address = req.body.addr;

			res.locals.user.save(function(err){
				if(!err){
					res.redirect("/session/account");
				}
				else{
					console.log(err);
					res.redirect("/session/account/edit");
				}
			})
		}
		else{
			console.log("Incorrect password");
			res.redirect("/session/account/edit");
		}
	})
	.delete(function(req, res){

	});

module.exports = router;
