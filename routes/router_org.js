var express = require("express");
var User = require("../models/user.model").User;
var router = express.Router();
var availablePermissions = require("../middlewares/org/available-sel");
var memberFinder = require("../middlewares/org/find-document");
var staffFinder = require("../middlewares/org/find-collection");
var redis = require("redis");

var client = redis.createClient();

/* Arquitectura para el manejo de documentos: CRUD = "Create Read Update Delete" */
/*REST - Staff*/

// Assign "availablePermissions" middleware to every staff member creation request
router.all("/new", availablePermissions);
router.get("/new", function(req, res){
	res.render("session/org/new", { permisos: res.locals.permisos });
});

// Assign "memberFinder" middleware to every document/id request 
router.all("/:id*", memberFinder); //Pa un miembro del equipo res.locals.member
// Assign "availableSelection" middleware to every document/id/edit request 
router.all("/:id/edit", availablePermissions);
// Despliega el formulario para edición de un documento específico
router.get("/:id/edit", function(req, res){
	res.render("session/org/edit", { member: res.locals.member });
});

// Assign "staffFinder" middleware to every document collection request
router.all("/", staffFinder); //Pa los integrantes

//CRUD miembros específicos
router.route("/:id")
	.get(function(req, res){//Mostrar miembro seleccionado
		res.render("session/org/show", {member: res.locals.member});
	})
	.put(function(req, res){//Editar miembro seleccionado
		res.locals.member.name = req.body.name;
		res.locals.member.lastName = req.body.lastName;
		res.locals.member.email = req.body.email;
		res.locals.member.gender = req.body.gender;
		res.locals.member.password = req.body.newPassword;
		res.locals.member.pass_confirm = req.body.password_confirmation;

		res.locals.member.save(function(err){
			if(!err){
				res.redirect("/session/org/");	
			}
			else{
				console.log(err);
				res.redirect("/session/org/"+req.params.id+"/edit");
			}				
		})
	})
	.delete(function(req, res){//Borrar miembro seleccionado
		User.findOneAndRemove({_id: req.params.id}, function(err){
			if(!err){
				res.redirect("/session/org");
			}
			else{
				res.redirect("/session/org/"+req.params.id)
			}
		});
	});
//CRUD colección de miembros propios
router.route("/")
	.get(function(req, res){//Retorna todos los miembros del usuario
		res.render("session/org/collection", {staff: res.locals.staff});
	})
	.post(function(req, res){//Crea un nuevo miembro	
		var role = (res.locals.user.permission == "Admin") ? req.body.permission : "Resource";
		var pBranch = (role == "Resource") ? res.locals.user._id : undefined;
		var brchWorkHrs = (role == "Resource") ? res.locals.user.workHours : undefined;
		var addr = (role == "Branch") ? req.body.addr : undefined;
		var datos = {
			name: req.body.name,
			lastName: req.body.lastName,
			email: req.body.email,
			gender: req.body.gender,
			password: req.body.newPassword,
			pass_confirm: req.body.password_confirmation,
			permission: role,
			parentBranch: pBranch,
			workHours: brchWorkHrs,
			address: addr
		};
		var member; 
		switch (role){
			case "Resource":
				member = new Resource(datos);	
				break;
			case "Branch":
				member = new Branch(datos);	
				break;
			default://Hoy Admin no tiene atributos específicos más que User
				member = new User(datos);
		}			

		member.save(function(err){
			if(!err){
				client.publish("staff", JSON.stringify(member));
				// Streaming!
				res.redirect("/session/org/"+member._id);
			}
			else{
				console.log("error creando miembro");
				res.send(err);
			}
		});
	});	

/*REST - Miembros de la organización*/

module.exports = router;
