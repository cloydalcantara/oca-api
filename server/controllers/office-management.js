const meta = require('../libs/meta')

module.exports = {
  fetchAll: async (req, res, next) => {
    let count = "SELECT COUNT(*) FROM office_structure";
    await db.query(count, function(err, count){
      if(count[0]['COUNT(*)'] > 0){
        const limit = 10
        const pageCount = Math.ceil(count[0]['COUNT(*)'] / limit)
        const skip = (parseInt(req.query.page) - 1) * limit
        let query = "SELECT * FROM office_structure LIMIT "+ limit +" OFFSET "+skip;
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
      }else{
        res.json({err: "NO RECORD FOUND!"})
      }
    })
  },
  fetchById: async (req, res, next) => {
    let query = "SELECT * FROM office_structure where office_id = " +req.params.id;
    await db.query(query, function(err, result){
      if(err){
        res.json({err: "Please contact the system administrator to fixed the system malfunction!"})
      }else{
        if(result.length > 0){
          res.json(result[0])
        }else{
          res.json({err: "NO RECORD FOUND!"})
        }
      }
    })
  },
  registerUser: async ( req, res, next ) => {
    const data = {
      office_id: req.body.office_id,
      office_name: req.body.office_name,
      office_description: req.body.office_description,
      office_location: req.body.office_location
    }
    await db.query('INSERT INTO office_structure SET ? ',data, function(err, result){
      if(err){
        res.json({err: "There's an error in inserting OFFICE!"})
      }else{
        res.json({data: "Insert Successfully!"})
      }
    })
  }
}