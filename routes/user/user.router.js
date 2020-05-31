const express = require('express');
const router = express.Router();
const { User, Benefactor } = require('../../models/user.model');

router.get('/', async (req, res) => {
  let user;
  console.log(req.body);
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

router.post('/', async (req, res) => {
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

module.exports = router;