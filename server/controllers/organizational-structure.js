const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration');
const bcrypt = require('bcryptjs');
const meta = require('../libs/meta')

module.exports = {
  fetchAll: async (req, res, next) => {
    
    let count = "SELECT COUNT(*) FROM users";

    await db.query(count, function(err, count){
      const limit = 10
      const pageCount = Math.ceil(count[0]['COUNT(*)'] / limit)
      const skip = (parseInt(req.query.page) - 1) * limit

      let query = "SELECT * FROM users LIMIT "+ limit +" OFFSET "+skip;
      db.query(query, function(err, result){
        if(err){
          res.json({err: "Please contact the system administrator to fixed the system malfunction!"})
        }else{
          res.json({
            meta: meta(null, req.query.page, count[0]['COUNT(*)'], limit),
            data: result
          })
        }
      })
    })
  },
  fetchById: async (req, res, next) => {
    let query = "SELECT * FROM users where employeeid = " +req.params.id;
        
    await db.query(query, function(err, result){
      if(err){
        res.json({err: "Please contact the system administrator to fixed the system malfunction!"})
      }else{
        res.json(result[0])
      }
    })
  },
  registerUser: async ( req, res, next ) => {
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(req.body.password, salt);

    res.json(passwordHash)

  }
}