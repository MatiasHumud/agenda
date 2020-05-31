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
const userRouter = require('./routes/user/user.router');
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

app.post('/login', async (req, res) => {
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

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

app.use('/session', currentSessionMiddleware);
app.use('/session', sessionRouter);
app.use('/user', userRouter);
app.use('/session/contract', contractRouter);

server.listen(3000, () => { console.log('Example app listening on port 3000!') });
