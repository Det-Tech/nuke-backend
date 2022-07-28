const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const multer = require('multer');
const fs = require("fs");

// Load input validation
const {validateRegisterInput, validateWallet} = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const UserLead = require("../../models/UserLead");

// @route POST api/users/register
// @desc Register user
// @access Public

router.post('/edit-profile',multer({ dest: 'uploads' }).any(), async (req,res) => {
    if(req.files.length!=0){
      var originalname = req.files[0].originalname;
      var new_path = 'uploads/avatars/' + originalname;
      var old_path = req.files[0].path;
      fs.readFile(old_path, function(err, data) {
          fs.writeFile(new_path, data, function(err) {
            fs.unlink('uploads/' + req.files[0].filename, async err => {
                  if(!err){}
                  else{
                    console.log(err)
                  }
              })
            })
      })
    }
      const data = { 
          name: req.body.name,
          email: req.body.email,
          bio: req.body.bio,
          site: req.body.site,
          facebook: req.body.facebook, 
          twitter: req.body.twitter, 
          instagram: req.body.instagram, 
          linkedin: req.body.linkedin, 
          discord: req.body.discord, 
          file_path: new_path,
          public: 1
      }
      try{
        const result = await User.findOneAndUpdate({wallet: req.body.wallet}, data);
        res.json({"Success":"OK"})
      }catch(err){
        res.json({"Success":"NO"})
      }
      
})

// @route POST api/users/create-lead
// @desc return Status
// @access Public

router.post('/create-lead',multer({ dest: 'uploads' }).any(), async (req,res) => {
  if(req.files.length!=0){
    var originalname = req.files[0].originalname;
    var new_path = 'uploads/lead/' + originalname;
    var old_path = req.files[0].path;
    fs.readFile(old_path, function(err, data) {
        fs.writeFile(new_path, data, function(err) {
          fs.unlink('uploads/' + req.files[0].filename, async err => {
                if(!err){}
                else{
                  console.log(err)
                }
            })
          })
    })
  }
  try{
    if(!await UserLead.findOne({ wallet: req.body.wallet })) {
      const newUser = new UserLead({
        wallet: req.body.wallet,
        owner: req.body.owner,
        name: req.body.name,
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        fax: req.body.fax,
        mobile: req.body.mobile,
        site: req.body.site,
        source: req.body.source,
        status: req.body.status,
        industry: req.body.industry,
        employes: req.body.employes,
        revenue: req.body.revenue,
        rating: req.body.rating,
        skype: req.body.skype,
        secEmail: req.body.secEmail,
        twitter: req.body.twitter,
        emailOpt: req.body.emailOpt,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        country: req.body.country,
        file_path: new_path
      });
      newUser.save()
      res.json({"Success":"OK"})
    }
  }catch(err){
    console.log(err)
    res.json({"Success":"NO"})
  }
})

// @route POST api/users/valid-custom-url
// @desc verify custom url and return Wallet Info
// @access Public

router.post("/valid-custom-url", (req, res) => {
  User.findOne({customUrl: req.body.customUrl})
  .then((value)=>{
    if(value){
      if(value.publicKey==req.body.publicKey){
        res.json(value);
      }
      else{
        res.json({status: "exist"});
      }
    }
    else{
      res.json(200);
    }
  })
})

// @route POST api/users/get-profile
// @desc return Wallet Info
// @access Public

router.post("/get-profile", async(req, res)=>{
  try {
    res.json(await User.findOne({wallet: req.body.wallet}));
  }catch(err){
    res.json("error");
    console.log("Exception: get-profile")
  }
})

// @route POST api/users/wallet-connect
// @desc Wallet Connect and return Wallet Info
// @access Public

router.post("/wallet-connect", (req, res) => {
  // Form validation

  const { errors, isValid } = validateWallet(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ wallet: req.body.wallet }).then(user => {
    if (user) {
      return res.json(user);
    } else {
      const newUser = new User({
        wallet: req.body.wallet,
      });
      newUser
      .save()
      .then(user => res.json(user))
      .catch(err => console.log(err));
    }
  });
});


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
