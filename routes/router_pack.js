var express = require("express");
var Pack = require("../models/pack").Pack;
var User = require("../models/user.model").User;
var router = express.Router();
var fs = require("fs");
var packFinder = require("../middlewares/packs/find-document");
var docCollectionFinder = require("../middlewares/packs/find-collection");
var availableSelection = require("../middlewares/packs/available-sel");
var redis = require("redis");
var moment = require("moment");

var client = redis.createClient();

/* Arquitectura para el manejo de packs: CRUD = "Create Read Update Delete" */
/* En este caso, "documento" son los eventos (sesiones de tratamiento) */
/*REST - Documentos*/

// Assign "availableSelection" middleware to every document creation request
router.all("/new", availableSelection);
router.get("/new", function(req, res){
	res.render("session/packs/new", 
		{ 
			users: res.locals.users,
			packTypes: res.locals.packTypes
		});
});

// Assign "packFinder" middleware to every document/id request 
router.all("/:id*", packFinder);
// Assign "docCollectionFinder" middleware to every document collection request
router.all("/", docCollectionFinder);

//CRUD packs específicos
router.route("/:id")
	.get(function(req, res){//Mostrar pack seleccionado
		res.render("session/packs/show", {pack: res.locals.pack});
	})
	.delete(function(req, res){//Borrar pack seleccionado
		if(res.locals.pack.isRemovable) {
			Pack.findOneAndRemove({_id: req.params.id}, function(err){
				if(!err){
					res.redirect("/session/packs");
				}
				else{
					res.redirect("/session/packs/"+req.params.id)
				}
			});
		}
	});
//CRUD colección de packs propios
router.route("/")
	.get(function(req, res){//Retorna todos los packs del usuario
		res.render("session/packs/collection", {packs: res.locals.packs});
	})
	.post(function(req, res){//Crea un nuevo pack
		var treat = [];
		for (var i = 0; i < req.body.nZones; i++){
			treat.push({
				docs: undefined
			});
		}
		var pack = new Pack({
			packType: req.body.pTyp,
			usuario: req.body.usr,
			dateBought: Date.now(),
			treatment: treat
		});

		pack.save(function(err){
			if(!err){
				client.publish("packs", JSON.stringify(pack));
				res.redirect("/session/packs/"+pack._id);
			}
			else{
				console.log("error creando pack");
				res.send(err);
			}
		});
	});	

/*REST - Packs*/

module.exports = router;