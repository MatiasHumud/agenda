const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const { Benefactor, User } = require('./models/user.model');
const session =require('express-session');
const currentSessionMiddleware = require('./middlewares/currentSession');
const methodOverride = require('method-override');
const RedisStore = require('connect-redis')(session);
const realtime = require('./realtime');
const sessionRouter = require('./routes/session/session.router');
const contractRouter = require('./routes/contract/contract.router');

const app = express();
const server = http.Server(app);

const sessionMiddleware = session({
	store: new RedisStore({}),
	secret: 'd6s5f9liofd5g146fvdf6156a'
});

realtime(server, sessionMiddleware);

app.use(methodOverride('_method'));
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(sessionMiddleware);

app.set('view engine', 'jade');

app.get('/', (req, res) => {
	res.render('index', { currentSession: req.session.userId });
});

app.get('/registration', (req, res) => {
	res.render('registration');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

app.post('/newUser', async (req, res) => {
  let benefactor;

  benefactor = await Benefactor.findOne({ email: req.body.email });

  if(benefactor) {
    console.log(`El correo ${benefactor.email} ya está registrado`);
    res.redirect('/');
    return;
  }

  try {
    benefactor = new Benefactor(req.body);

    await benefactor.save();

    console.log(`Guardamos tus datos: Email ${benefactor.email} / Password ${benefactor.password}`);
    req.session.userId = benefactor.userId;
    res.redirect('/session');
  } catch (error) {
    console.log({ error });
    console.log('No pudimos guardar tus datos');
    res.redirect('/');
  }
});

app.post('/knock', async (req, res) => {
  let user;

  try {
    user = await User.findOne({ email: req.body.email, password: req.body.password });
    if(user){
      req.session.userId = user.userId;
      console.log(`Login: ${user.fullName}`);
      res.redirect('/session');
      return;
    }
    console.log('Datos Incorrectos');
    res.redirect('/login');
  } catch (error) {
    console.log({ error });
    console.log('No pudimos validar tu usuario');
    res.redirect('/login');
  }
});

app.use('/session', currentSessionMiddleware);
app.use('/session', sessionRouter);
app.use('/session/contract', contractRouter);

server.listen(3000, () => { console.log('Example app listening on port 3000!') });
