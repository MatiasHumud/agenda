var express = require("express");
var Documento = require("../models/contract.model").Documento;
var User = require("../models/user.model").User;
var Resource = require("../models/user.model").Resource;
var Service = require("../models/service").Service;
var Event = require("../models/event").Event;
var router = express.Router();
var fs = require("fs");
var blockFinder = require("../middlewares/blocks/find-document");
var blockCollectionFinder = require("../middlewares/blocks/find-collection");
var availableSelection = require("../middlewares/blocks/available-sel");
var redis = require("redis");
var moment = require("moment");

var client = redis.createClient();

/* Arquitectura para el manejo de horarios: CRUD = "Create Read Update Delete" */
/* En este caso, "documento" son los eventos (sesiones de tratamiento) */
/*REST - horarios*/

// Despliega el formulario para creación de un bloqueo
router.all("/new", availableSelection);
router.get("/new", function(req, res){
	res.render("session/horarios/new", 
		{
			branches: res.locals.branches,
			resources: res.locals.resources
		});
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
		editInDB(req, res);
		res.redirect("/session/horarios/");	
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
		saveToDB(req, res);
		res.redirect("/session/horarios/")
	});		

async function saveToDB(req, res){
	var blockTitle = "block";
	var evt = JSON.parse(req.body.dateSelect);
	var usr = req.body.userId;
	var docs = new Array(Documento);
	var ress = await Resource.find({_id: req.body.resces}).exec();

	for(var i = 0; i < ress.length; i++){
		docs[i] = new Documento({
			title: blockTitle,
			status: blockTitle,
			usuario: usr,
			servicio: undefined,
			recurso: ress[i],
			sucursal: ress[i].parentBranch,
			event: Event(evt)
		});
	}

	Documento.insertMany(docs, function(err, svDocs){
		if(!err){
			return true;
		}
		else{
			console.log("Error on saving: "+ err);
			return false;
		}
	});
}

async function editInDB(req, res){
	res.locals.documento.event = new Event(JSON.parse(req.body.dateSelect));
	res.locals.documento.save(function(err){
		if(!err){
			return true;
		}
		else{
			console.log("Error on saving: "+ err);
			return false;
		}				
	})
}

module.exports = router;
