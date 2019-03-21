var express = require("express");
var User = require("../models/user").User;
var router = express.Router();
var redis = require("redis");

var client = redis.createClient();

router.get("/", function(req, res){
	res.render("session/home");
});

router.get("/cuenta/edit", function(req, res){
	res.render("session/cuenta/edit");
});
//CRUD cuenta
router.route("/cuenta")
	.get(function(req, res){//Mostrar info usuario
		res.render("session/cuenta/show", {user: res.locals.user});
	})
	.put(function(req, res){//Editar cuenta de usuario
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
					res.redirect("/session/cuenta");
				}
				else{
					console.log(err);
					res.redirect("/session/cuenta/edit");
				}
			})
		}
		else{
			console.log("Incorrect password");
			res.redirect("/session/cuenta/edit");
		}
	})
	.delete(function(req, res){//Borrar cuenta de usuario

	});

module.exports = router;
