var express = require("express");
var Documento = require("../models/documento").Documento;
var User = require("../models/user").User;
var Resource = require("../models/user").Resource;
var Service = require("../models/service").Service;
var Event = require("../models/event").Event;
var router = express.Router();
var fs = require("fs");
var blockFinder = require("../middlewares/blocks/find-document");
var blockCollectionFinder = require("../middlewares/blocks/find-collection");
var ressEventFinder = require("../middlewares/resource-doc-collection");
var redis = require("redis");
var moment = require("moment");

var client = redis.createClient();

/* Arquitectura para el manejo de horarios: CRUD = "Create Read Update Delete" */
/* En este caso, "documento" son los eventos (sesiones de tratamiento) */
/*REST - horarios*/
router.all("/events", ressEventFinder);
router.get("/events", function(req, res){
	res.json(res.locals.eventos);
});

// Despliega el formulario para creación de un bloqueo
router.get("/new", function(req, res){
	res.render("session/horarios/new");
});

// Despliega el formulario para edición de un bloqueo específico
router.all("/:id*", blockFinder);
router.get("/:id/edit", function(req, res){
	if(res.locals.documento.status != "ejecutado"){
		res.render("session/horarios/edit");
	}
	else{
		res.redirect("/session/horarios/");
	}
});

// Assign "blockCollectionFinder" middleware to every document collection request
router.all("/", blockCollectionFinder);
//CRUD bloqueos específicos
router.route("/:id")
	.get(function(req, res){//Mostrar bloqueo seleccionado
		res.render("session/horarios/show", {documento: res.locals.documento});
	})
	.put(function(req, res){//Editar bloqueo seleccionado
		var usr, ress, bch = undefined;
		switch(req.body.perm) {
			case "Branch":
				usr = req.body.userId; 
				bch = req.body.userId;
				break;
			case "Resource":
				usr = req.body.userId; 
				ress = req.body.userId;
				break;
		}
		res.locals.documento.usuario = usr;
		res.locals.documento.servicio = undefined;
		res.locals.documento.recurso = ress;
		res.locals.documento.sucursal = bch;
		if(req.body.dateSelect){
			res.locals.documento.event = new Event(JSON.parse(req.body.dateSelect));
			res.locals.documento.event.title = "block";
		}
		
		res.locals.documento.save(function(err){
			if(!err){
				res.redirect("/session/horarios/");	
			}
			else{
				console.log(err);
				res.redirect("/session/horarios/"+req.params.id+"/edit");
			}				
		})
	})
	.delete(function(req, res){//Borrar bloqueo seleccionado
		Documento.findOneAndRemove({_id: req.params.id}, function(err){
			if(!err){
				res.redirect("/session/horarios");
			}
			else{
				res.redirect("/session/horarios/"+req.params.id)
			}
		});
	});
//CRUD colección de bloqueos propios
router.route("/")
	.get(function(req, res){//Retorna todos los bloqueos del usuario
		res.render("session/horarios/collection", {horarios: res.locals.horarios});
	})
	.post(function(req, res){//Crea un nuevo bloqueo
		if (req.body.dateSelect) {
			var blockTitle = "block";
			var evt = JSON.parse(req.body.dateSelect);
			evt.title = blockTitle;
			var usr, ress, bch = undefined;

			switch(req.body.perm) {
				case "Branch":
					usr = req.body.userId; 
					bch = req.body.userId;
					replicateBlocks(req, res);
					break;
				case "Resource":
					usr = req.body.userId; 
					ress = req.body.userId;
					break;
			}

			var bloqueo = new Documento({
				title: blockTitle,
				usuario: usr,
				servicio: undefined,
				recurso: ress,
				sucursal: bch,
				event: Event(evt)
			});

			bloqueo.save(function(err){
				if(!err){
					client.publish("hourBlock", JSON.stringify(bloqueo));
					res.redirect("/session/horarios/"+bloqueo._id);
				}
				else{
					console.log("error creando bloqueo");
					res.send(err);
				}
			});

		}
		
	});		

async function replicateBlocks(req, res){
	var bloqueos = new Array(Documento);
	var blockTitle = "block";
	var evt = JSON.parse(req.body.dateSelect);
	evt.title = blockTitle;
	var bch = req.body.userId;
	var ress = await Resource.find({parentBranch: bch}).exec();

	if(ress != undefined){
		for(var i = 0; i < ress.length; i++){
			bloqueos[i] = new Documento({
				title: blockTitle,
				usuario: bch,
				servicio: undefined,
				recurso: ress[i],
				sucursal: bch,
				event: Event(evt)
			});
		}
	}
	
	Documento.insertMany(bloqueos, function(err, docs){
		if(!err){
			return true;
		}
		else{
			console.log("Error on replicating! "+ err);
			return false;
		}
	});
}

module.exports = router;