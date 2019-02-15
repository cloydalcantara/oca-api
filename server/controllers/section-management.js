const meta = require('../libs/meta')

module.exports = {
  fetchAll: async (req, res, next) => {
    let count = "SELECT COUNT(*) FROM sector_structure";
    await db.query(count, function(err, count){
      if(count[0]['COUNT(*)'] > 0){
        const limit = 10
        const pageCount = Math.ceil(count[0]['COUNT(*)'] / limit)
        const skip = (parseInt(req.query.page) - 1) * limit
        let query = "SELECT * FROM sector_structure LIMIT "+ limit +" OFFSET "+skip;
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
    let query = "SELECT * FROM sector_structure where sector_id = " +req.params.id;
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
      sector_id: req.body.sector_id,
      division_id: req.body.division_id,
      office_id: req.body.office_id,
      sector_name: req.body.sector_name,
      sector_description: req.body.sector_description,
      sector_location: req.body.sector_location
    }
    await db.query('INSERT INTO sector_structure SET ? ',data, function(err, result){
      if(err){
        res.json({err: "There's an error in inserting OFFICE!"})
      }else{
        res.json({data: "Insert Successfully!"})
      }
    })
  }
}