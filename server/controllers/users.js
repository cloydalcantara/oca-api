const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration');
const bcrypt = require('bcryptjs');
const meta = require('../libs/meta')

signToken = user => {
  console.log("user",user)
  return JWT.sign({
    iss: 'onlinecompetencyassessmenttarget',
    sub: user.employeeid,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

module.exports = {
  fetchAll: async (req, res, next) => {
    
    let count = "SELECT COUNT(*) FROM users";

    await db.query(count, function(err, count){
      if(count[0]['COUNT(*)'] > 0){
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
      }else{
        res.json({err: "NO RECORD FOUND!"})
      }
      
    })
  },
  fetchById: async (req, res, next) => {
    let query = "SELECT * FROM users where employeeid = " +req.params.id;
        
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
    console.log(req)
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const data = {
      employeeid: req.body.employeeid,
      firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      suffix: req.body.suffix,
      birthday: req.body.birthday,
      gender: req.body.gender,
      password: passwordHash,
      house_no_building_streetname: req.body.house_no_building_streetname,
      barangay: req.body.barangay,
      city_municipality: req.body.city_municipality,
      province: req.body.province,
      country: req.body.country,
      organizational_structure: req.body.organizational_structure,
      office: req.body.office,
      position: req.body.position
    }
        
    await db.query('INSERT INTO users SET ? ',data, function(err, result){
      if(err){
        console.log(err)
        res.json({err: "Duplicate Entry for Employee ID!"})
      }else{
        res.json({data: "Employee Registered Successfully!"})
      }
    })

  },
  signIn: async (req, res, next) => {
    // Generate token
    await db.query('SELECT * FROM users where employeeid = '+ req.body.employeeid , async function(err, result){
      if(err){
        res.json({err: "Invalid Login. Please Check your Employee ID and Password!"})
      }else{
        bcrypt.compare(req.body.password, result[0].password, function(err, resb) {
          if (err){
            res.json({success: false, message: "Invalid Login. Please Check your Employee ID and Password!"})
          }
          if (res){
            res.json({success: true, message: "Login successfully!", token: signToken(req.body)})
          } else {
            res.json({success: false, message: "Invalid Login. Please Check your Employee ID and Password!"})
          }
        })
      }
    })

    // if(req.user && req.user.local && req.user.local.disabled){
    //     res.status(200).json({ disabled: true });
    // }else{
    //     const token = signToken(req.user);
    //     res.status(200).json({ token , data:req.user});
    // }
   
    
  }
}