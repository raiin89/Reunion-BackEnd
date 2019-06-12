
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const config = require('./../config/database')
const nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs')
var multer  = require('multer')
const path = require('path')
const senderMail = 'genforeningen2020@gmail.com'
const pass = 'Rad0933196192'


  const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('userimage');

  // Check File Type
  function checkFileType(file, cb){
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderMail,
      pass: pass 
    }
  });

  // Signing in
module.exports.signin = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw err
    if (!user) {
      res.json({success: false, msg: 'Authentication failed. User not found...!!!'})
    } else {
      // checks if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
            // Declare a token
            const token = jwt.sign(user.toJSON(), config.secret, {expiresIn :'60m'})
            // Send the token
            res.json({success: true, msg: 'Logind vellykket', token: token, User:user})
        } else {
          res.json({success: false, msg: 'Logind mislykkedes. Forkert kodeord!'})
        }
      })
    }
  })
}

// Signing up
module.exports.signup = async (req, res, next) => {
  var source = req.body.source;
  console.log("signup User Api", req.body);
  try{
      if(!req.body.password)
      {
        res.json({success: false, msg: 'adgangskode er påkrævet!'})
      }
      else{
        let founduser = await User.findOne({email: req.body.email});
        if(founduser)
        {
          res.json({success: false, msg: '!'})
        }else{
          let user = {
              name:req.body.name,
    		      email:req.body.email,
              password:req.body.password,
              role: req.body.role
          }
          let newUser = new User(user)
          await newUser.save();
          res.json({success: true, msg: 'Bruger oprettet succesfuldt', })
        }
      }
  }catch(e){
    console.log("Error", e);
    res.json({success: false, msg: 'Kunne ikke oprette bruger!'})
  }
}

// Adds a coordinate by the admin
module.exports.addUser = async (req, res, next) => {
  console.log("add user Api", req.body);
  try{
        let founduser = await User.findOne({email: req.body.email});
        if(founduser)
        {
          res.json({success: false, msg: 'Bruger Email Adresse findes allerede!'})
        }else{
          // Creates a random password to be sent 
          const randompsw = Math.floor((Math.random() * 1000000) + 1).toString();
          let user = {
              name:req.body.name,
    		      email:req.body.email,
              password:randompsw,
              role: 'coordinate'
          }
          let newUser = new User(user)
          await newUser.save();
          var mailOptions = {
            from: senderMail,
            to: req.body.email,
            subject: 'Genforingen admin tilmelding',
            html: '<h4> Du er nu oprettet som adminstrator <br> Brug venligst denne kode som dit midlertidige kodeord: </h4> <h1> '+randompsw+' <br> Genforingen 2020 </h1>  '
      
          };
      
          transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
              console.log("not sent bcz: "+error);
              res.json({success: false, msg: 'Unable to send Email!'})
      
            } else {
              console.log('Email sent: ' + info.response);
              // Encrypting password
              bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                  console.log("err: ", err);
                }
                bcrypt.hash(randompsw, salt, null, async function (err, hash) {
                  if (err) {
                    console.log("err: ", err);
                  }else{
                    
                    var result = await User.findOneAndUpdate({ email: req.body.email},{$set:{ password: hash}},{new: true})
                    res.json({success: true, msg: 'Bruger oprettet succesfuldt', })
                  }
      
                })
              })
      
            }
          });
        }

  }catch(e){
    console.log("Error", e);
    res.json({success: false, msg: 'Kunne ikke oprette brugen'})
  }
}

// Forget password
module.exports.forgetpassword = async (req, res, next) => {
  console.log("forgetpassword User Api", req.body);
  try{
    const randompsw = Math.floor((Math.random() * 1000000) + 1).toString();


    var mailOptions = {
      from: senderMail,
      to: req.body.email,
      subject: 'Glem adgangskode',
      html: '<h4>Brug venligst denne kode som dit midlertidige kodeord:</h4> <h1> '+randompsw+' <br> Genforingen 2020 </h1>  '

    };

    transporter.sendMail(mailOptions, async function(error, info){
      if (error) {
        console.log("not sent bcz: "+error);
        res.json({success: false, msg: 'Unable to send Email!'})

      } else {
        console.log('Email sent: ' + info.response);
        bcrypt.genSalt(10, function (err, salt) {
          if (err) {
            console.log("err: ", err);
          }
          bcrypt.hash(randompsw, salt, null, async function (err, hash) {
            if (err) {
              console.log("err: ", err);
            }else{
              var result = await User.findOneAndUpdate({ email: req.body.email},{$set:{ password: hash}},{new: true})
              res.json({success: true, msg: 'Password email sent Successfully...!!!', })
            }

          })
        })

      }
    });
  }catch(e){
    console.log("Error", e);
    res.json({success: false, msg: 'Unable to Complete process!'})
  }
}

// Change password
module.exports.changepassword = (req, res, next) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) throw err
    console.log("user found: ",user)
    if (!user) {
      res.json({success: false, msg: 'Authentication failed. User not found...!!!'})
    } else {
      // check if password matches
      user.comparePassword(req.body.password, async (err, isMatch) => {
        if (isMatch && !err) {
          let newpassword = req.body.newpassword;
          bcrypt.genSalt(10, function (err, salt) {
            if (err) {
              console.log("err: ", err);
            }
            bcrypt.hash(newpassword, salt, null, async function (err, hash) {
              if (err) {
                console.log("err: ", err);
              }

              newpassword = hash;
              await  User.findOneAndUpdate({ email: req.body.email}, {$set :{password:newpassword}})
              res.json({success: true, msg: 'Password Updated Successfully...!!!'})

            })
          })

        } else {
          res.json({success: false, msg: 'Authentication failed. Wrong password...!!!'})
        }
      })
    }
  })
}

// Update user
module.exports.editUser = (req, res, next) => {
  User.findOne({
    _id: req.body.id
  }, (err, user) => {
    if (err) throw err
    if (!user) {
      res.json({success: false, msg: 'Godkendelse mislykkedes. Bruger ikke fundet!'})
    } else {
        User.findOneAndUpdate({ _id: req.body.id}, {$set :{name:req.body.name, email:req.body.email}}, (err, updateResult) => {
          if(err) {
            res.json({success: false, msg: 'Kunne ikke opdatere bruger!'})
          }else{
            res.json({success: true, msg: 'Bruger opdateret succesfuldt!'})
          }
        })
  }
})
}

// Fetches all users
module.exports.fetchAlluser = async (req, res, next) => {
  try{
      let found = await User.find({role:'coordinate'}, 'email name role').sort( { createdAt: -1 } )
      .exec()
      res.json({success: true, data:found})
  }catch(e){
    console.log("error",e);
    res.json({success: false, msg: "Something went wrong!"})
  }
}

// Delete user
module.exports.deleteuser = async (req, res, next) => {
  try{
      let found = await User.findOneAndRemove({"_id": req.body.userid})
      if(found !== null){
        res.json({success: true, msg: "Bruger er slettet"})
      }else{
        res.json({success: true, msg: "Bruger kunne ikke findes"})
      }
    }catch(e){
      console.log("error",e);
      res.json({success: false, msg: "Noget gik galt"})
    }
}

