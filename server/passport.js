const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./configuration');

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
  try {
    if(payload.exp > Date.now()){
      let query = "SELECT * FROM users where employeeid = " +payload.sub;

      await db.query(query, function(err, result){
          if(result.length > 0){
              return done(null, result[0]);
          }else {
              return done(null, false);
          }
      })
    }else{
      return done(null, false);
    }
    
  } catch(error) {
    done(error, false);
  }
}));