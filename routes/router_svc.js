var express = require("express");
var Service = require("../models/service").Service;
var router = express.Router();
var availableServices = require("../middlewares/services/available-sel");
var serviceFinder = require("../middlewares/services/find-document");
var svcCollFinder = require("../middlewares/services/find-collection");
var redis = require("redis");

var client = redis.createClient();

/* Arquitectura para el manejo de servicios: CRUD = "Create Read Update Delete" */
/*REST - Servicios*/

// Assign "availableServices" middleware to every service creation request
router.all("/new", availableServices);
router.get("/new", function(req, res){
	res.render("session/servicios/new", { tipos: res.locals.tipos });
});

// Assign "serviceFinder" middleware to every servicios request 
router.all("/:id*", serviceFinder);
// Assign "availableSelection" middleware to every servicios/edit request 
router.all("/:id/edit", availableServices);
// Despliega el formulario para edición de un servicios específico
router.get("/:id/edit", function(req, res){
	res.render("session/servicios/edit", { service: res.locals.service });
});

// Assign "svcCollFinder" middleware to every document collection request
router.all("/", svcCollFinder);

//CRUD documentos específicos
router.route("/:id")
	.get(function(req, res){//Mostrar servicio seleccionado
		res.render("session/servicios/show", {service: res.locals.service});
	})
	.put(function(req, res){//Editar servicio seleccionado
		res.locals.service.name = req.body.name;
		res.locals.service.category = req.body.category;
		res.locals.service.brief = req.body.brief;
		if(req.body.isAllDay == "on"){
			res.locals.service.isAllDay = true;
			res.locals.service.moduleCount = 36;
		}
		else{
			res.locals.service.isAllDay = false;
			res.locals.service.moduleCount = req.body.moduleCount;
		}

		res.locals.service.save(function(err){
			if(!err){
				res.redirect("/session/servicios/");	
			}
			else{
				console.log(err);
				res.redirect("/session/servicios/"+req.params.id+"/edit");
			}				
		})
	})
	.delete(function(req, res){//Borrar documento seleccionado
		Service.findOneAndRemove({_id: req.params.id}, function(err){
			if(!err){
				res.redirect("/session/servicios");
			}
			else{
				res.redirect("/session/servicios/"+req.params.id)
			}
		});
	});
//CRUD colección de miembros propios
router.route("/")
	.get(function(req, res){//Retorna todos los miembros del usuario
		res.render("session/servicios/collection", {services: res.locals.services});
	})
	.post(function(req, res){//Crea un nuevo servicio	
		var offeredSvc = new Service({
			name: req.body.name,
			category: req.body.category,
			brief: req.body.brief,
			isAllDay: (req.body.isAllDay == "on") ? true : false,
			moduleCount: (req.body.isAllDay == "on") ? 36 : req.body.moduleCount
		});

		offeredSvc.save(function(err){
			if(!err){
				client.publish("service", JSON.stringify(offeredSvc));
				// Streaming!
				res.redirect("/session/servicios/"+offeredSvc._id);
			}
			else{
				console.log("error creando servicio");
				res.send(err);
			}
		});
	});	

/*REST - Servicios de la empresa*/

module.exports = router;