const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const { Benefactor, User } = require("./models/user.model");
const session =require("express-session");
const session_middleware = require("./middlewares/sessions");
const methodOverride = require("method-override");
const RedisStore = require("connect-redis")(session);
const realtime = require("./realtime");
const sessionRouter = require("./routes/session/session.router");
const contractRouter = require("./routes/contract.router");
const router_org = require("./routes/router_org");

const app = express();
const server = http.Server(app);

const sessionMiddleware = session({
	store: new RedisStore({}),
	secret: "d6s5f9liofd5g146fvdf6156a"
});

realtime(server, sessionMiddleware);

app.use(methodOverride("_method"));
app.use("/public", express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(sessionMiddleware);

app.set("view engine", "jade");

app.get("/", function(req, res) {
	res.render("index", {currentSession: req.session.userId});
});

app.get("/registration", function(req, res) {
	res.render("registration");
});

app.get("/login", function(req, res) {
	res.render("login");
});

app.get("/logout", function(req, res) {
	req.session.destroy();
	res.redirect("/");
});

app.post("/newUser", async (req, res) => {
  console.log('user_create_started');
  let benefactor;

  benefactor = await Benefactor.findOne({ email: req.body.email });

  if(benefactor) {
    console.log(`El correo ${benefactor.email} ya está registrado`);
    res.redirect("/");
    return;
  }

  try {
    benefactor = new Benefactor(req.body);

    await benefactor.save();

    console.log(`Guardamos tus datos: Email ${benefactor.email} / Password ${benefactor.password}`);
    req.session.userId = benefactor.userId;
    res.redirect("/session");
  } catch (error) {
    console.log({ error });
    console.log("No pudimos guardar tus datos");
    res.redirect("/");
  }
});

app.post("/knock", async function(req, res) {
  console.log('user_create_started');
  let user;

  try {
    user = await User.findOne({ email: req.body.email, password: req.body.password });
    if(user){
      req.session.userId = user.userId;
      console.log(`Login: ${user.fullName}`);
      res.redirect("/session");
      return;
    }
    console.log("Datos Incorrectos");
    res.redirect("/login");
  } catch (error) {
    console.log({ error });
    console.log("No pudimos validar tu usuario");
    res.redirect("/login");
  }
});

app.use("/session", session_middleware);
app.use("/session", sessionRouter);
app.use("/session/documentos", contractRouter);
app.use("/session/org", router_org);

server.listen(3000, () => { console.log('Example app listening on port 3000!') });
