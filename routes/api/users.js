const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const multer = require('multer');
const fs = require("fs");
var nodemailer = require('nodemailer');

// Load input validation
const {validateRegisterInput, validateWallet} = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// models
const User = require("../../models/User");
const UserLead = require("../../models/UserLead");
let CollectibleSchema = require('../../models/collectible');
const { collection } = require("../../models/User");


// @route POST api/users/edit-profile
// @desc Edit profile 
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

async function mailSend(){
  const frommail= "proninkirilll228@gmail.com"
  const password = "123456 "
  const tomail= "fleaminit@gmail.com"
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: frommail,
      pass: password
    }
  });

  var mailOptions = {
    from: frommail,
    to: tomail,
    subject: 'Sending Email using Node.js',
    text: `Partner Data`
    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    } 
    else{
    }
  });
}

// @route POST api/users/create-lead
// @desc create partners Info
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
        mobile: req.body.mobile,
        site: req.body.site,
        secEmail: req.body.secEmail,
        twitter: req.body.twitter,
        file_path: new_path
      });
      newUser.save()      
      // await mailSend();
      res.json({"Success":"OK"})
    }
  }catch(err){
    console.log(err)
    res.json({"Success":"NO"})
  }
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


// @route POST api/users/profile-private
// @desc Login user and set public of profile
// @access Public

router.post("/profile-private", (req, res) => {
  // Form validation

  const { errors, isValid } = validateWallet(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ wallet: req.body.wallet }).then(user => {
    if (!user) {
      return res.json({"Status":"Not Found the profile"});
    } else {
      if (user.public == 1) user.public = 0;
      else user.public = 1;
      user
      .save()
      .then(user => res.json(user))
      .catch(err => console.log(err));
    }
  });
});

// @route POST api/users/get-leaderboard-data
// @desc Login user and get all Leaderboard Data
// @access Public

router.post("/get-leaderboard-data", async(req, res) => {

  let results = [];
  const user = await User.find({});
  results.push(user);
  const usr = await User.find({});
  results.push(usr);

  res.json(results)

});


// @route POST api/users/get-profiles-follow
// @desc Login user and get profiles according to following/followers
// @access Public

router.post("/get-profiles-follow", async(req, res) => {
  // Form validation
  const { errors, isValid } = validateWallet(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await User.findOne({ wallet: req.body.wallet });
  if (!user) {
    return res.json({"Status":"Not Found the profile"});
  } 
  let temp;
  if(user.following&&req.body.collection == 4){
    temp = JSON.parse(user.following);
  }
  if(user.followers&&req.body.collection == 5){
    temp = JSON.parse(user.followers);
  }
  let results = [];
  for (var tmp in temp) {
    // skip loop if the property is from prototype
    const usr = await User.findOne({ wallet: tmp });
    results.push(usr);
  }
  res.json(results)
});

// @route POST api/users/get-collection-profile
// @desc Login user and get NFT collections according to My collection/My Purchased/Liked
// @access Public

router.post("/get-collection-profile", async(req, res) => {
  // Form validation
  // const { errors, isValid } = validateWallet(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  if(req.body.collection == 0){
    const collection = await CollectibleSchema.find({ });
    res.json(collection);
  }else if(req.body.collection == 1){
    const collection = await CollectibleSchema.find({ wallet: req.body.wallet, make: 1 });
    res.json(collection);
  }else if(req.body.collection == 2){
    const collection = await CollectibleSchema.find({ wallet: req.body.wallet, make: 0 });
    res.json(collection);
  }
  else if(req.body.collection == 3){
    // const collection = await CollectibleSchema.find({ wallet: req.body.wallet, make: 1 });
    // res.json(collection);
    res.json([]);
  }else{
    const collection = await CollectibleSchema.find({ });
    res.json(collection);
  }

});

// @route POST api/users/profile-follow
// @desc Login user and return follow or unfollw
// @access Public

router.post("/profile-follow", async(req, res) => {
  // Form validation

  // const { errors, isValid } = validateWallet(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const ownerWallet = req.body.wallet
  const followWallet = req.body.followWallet
  const user = await User.findOne({ wallet: ownerWallet });
  if (!user) {
    return res.json({"Status":"Not Found the profile"});
  } else { 
      try{
      let temp = {}
      if (user.following)
      { 
        temp = JSON.parse(user.following)
      } 
      if (temp[followWallet]) delete(temp[followWallet])
      else {
        temp[followWallet] = "Yes"; 
      }
      user.following = JSON.stringify(temp);
      user.follwingCount = temp.length;
      await user.save()
      }catch(err){ 
        console.log(err)
      }
  }

  const userFollow = await User.findOne({ wallet: followWallet });
  if (!userFollow) {
    return res.json({"Status":"Not Found the profile"});
  } else {
    try{
      let temp = {}
      if (userFollow.followers)
      { 
        temp = JSON.parse(userFollow.followers)
      } 
      if (temp[followWallet]) delete(temp[followWallet])
      else {
        temp[followWallet] = "Yes";
      }
      userFollow.followers = JSON.stringify(temp);
      await userFollow.save()
    }catch(err){
      console.log(err)
    }
  }
  res.json({"Status":"OK"});

});


// @route POST api/users/profile-like
// @desc Login user and return like or unlike
// @access Public

router.post("/profile-like", (req, res) => {
  // Form validation

  // const { errors, isValid } = validateWallet(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const ownerWallet = req.body.wallet
  const likedNFT = req.body.id
  
  User.findOne({ wallet: ownerWallet }).then(user => {
    if (!user) {
      return res.json({"Status":"Not Found the profile"});
    } else {
      if (user.like[likedNFT]) delete(user.like[likedNFT])
      else user.like[likedNFT] = "Yes";
      user
      .save()
      .then(usr => res.json(usr))
      .catch(err => console.log(err));
    }
  });

});

// @route POST api/users/get-topcreators
// @desc Login user and return top creators infos
// @access Public

router.post("/get-topcreators", (req, res) => {
  // Form validation

  // const { errors, isValid } = validateWallet(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.find({ }).sort({follwingCount:-1}).then(user => {
    if (!user) {
      return res.json({"Status":"Not Found the profile"});
    } else {
      res.json(user)
    }
  });

});

// @route POST api/users/get-product-details
// @desc Login user and return all data of nfts
// @access Public

router.post("/get-product-details", async(req, res) => {
  // Form validation
  // const { errors, isValid } = validateWallet(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  try{
    let results = [];
    const collect = await CollectibleSchema.findOne({ _id: req.body.id });
    if (!collect) {
      return res.json({"Status":"Not Found the NFT"});
    }
    results.push(collect)
    const user = await User.findOne({ wallet: collect.wallet });
    results.push(user);
    return res.json(results);
  }catch(err){
    console.log(err);
  }
  
 
});

module.exports = router;
