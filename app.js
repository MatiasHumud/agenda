var http = require("http");
var bodyParser = require("body-parser");
var express = require("express");
var User = require("./models/user").User;
var Resource = require("./models/user").Resource;
var Branch = require("./models/user").Branch;
var Admin = require("./models/user").Admin;
var session =require("express-session");
var router_sess = require("./routes/router_sess");
var router_doc = require("./routes/router_doc");
var router_org = require("./routes/router_org");
var router_svc = require("./routes/router_svc");
var router_hours = require("./routes/router_hours");
var router_packTypes = require("./routes/router_packTypes");
var session_middleware = require("./middlewares/sessions");
var methodOverride = require("method-override");
var RedisStore = require("connect-redis")(session);
var realtime = require("./realtime");
global.moduleLength = 15; //Length in mins of each module

var app = express();
var server = http.Server(app);

var sessionMiddleware = session({
	store: new RedisStore({}),
	secret: "d6s5f9liofd5g146fvdf6156a"
});

realtime(server, sessionMiddleware);

app.use(methodOverride("_method"));
app.use("/public", express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(sessionMiddleware);

app.set("view engine", "jade");

app.get("/", function(req, res){
	res.render("index", {currentSession: req.session.user_id});
});

app.get("/registration", function(req, res){
	res.render("registration");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.get("/logout", function(req, res){
	req.session.destroy(function(err) {
  		console.log(err);
	})
	res.redirect("/");
});
//Creación de usuario común (cliente)
app.post("/newUser", function(req, res){// Envío de formulario "Registration"
	
	User.findOne({ email: req.body.email}).then(function(usr){
		if(usr){// Si existe usuario con ese email
			console.log("El correo "+usr.email+" ya está registrado");
			res.redirect("/");
		}
		else{// Si no existe usuario con ese email, se crea
			var user = new User({
							email: req.body.email, 
							name: req.body.name,
							lastName: req.body.lastName, 
							password: req.body.password, 
							pass_confirm: req.body.password_confirmation
						});

			user.save().then(function(usr){
				console.log("Guardamos tus datos: Email "+usr.email+" / Password "+usr.password);
				req.session.user_id = usr._id;
				res.redirect("/session");
			},function(err){//Error al guardar datos en la base
				console.log(String(err));
				console.log("No pudimos guardar tus datos");
				res.redirect("/");
			});
		}
	},function(err){//Error al buscar en la base
		console.log(String(err));
		console.log("Error al buscar tu correo en la base de datos");
		res.redirect("/");
	});
});

app.post("/knock", function(req, res){// Envío de formulario "Login"
	User.findOne({email: req.body.email, password: req.body.password}).then(function(usr){
		if(usr){// Ingresamos a la sesión del usuario
			req.session.user_id = usr._id;
			console.log("Login: "+usr);
			res.redirect("/session");		
		}
		else{
			console.log("Datos Incorrectos");
			res.redirect("/login");
		}
	},function(err){
		console.log(String(err));
		console.log("No pudimos validar tu usuario");
		res.redirect("/login");
	});
});

// Sesión usuario
app.use("/session", session_middleware);
app.use("/session", router_sess);
app.use("/session/documentos", router_doc);
app.use("/session/org", router_org);
app.use("/session/servicios", router_svc);
app.use("/session/horarios", router_hours);
app.use("/session/packTypes", router_packTypes);

server.listen(3000);