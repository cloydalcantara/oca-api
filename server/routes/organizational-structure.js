const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const level = require('../controllers/organizational-structure');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/level/all')
  .get( level.fetchAll);

router.route('/level/single/:id')
  .get( level.fetchById);

router.route('/level/register')
  .get( level.registerUser )
  
module.exports = router;