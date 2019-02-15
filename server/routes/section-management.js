const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const user = require('../controllers/users');
const passportJWT = passport.authenticate('jwt', { session: false });
const multer = require('multer')


router.route('/user/all')
  .get( passportJWT, user.fetchAll);

router.route('/user/single/:id')
  .get(passportJWT, user.fetchById);

router.route('/user/register')
  .post( user.registerUser );

router.route('/user/signin')
  .post( user.signIn );
  
module.exports = router;