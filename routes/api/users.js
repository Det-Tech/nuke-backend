const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const multer = require('multer');
const fs = require("fs");
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const xlsx = require('node-xlsx');

// models
const User = require("../../models/User");

// @route GET api/users/get-all
// @desc return Wallets Info
// @access Public

router.get("/get-all", async(req, res)=>{
  try {
    res.json(await User.find({}));
  }catch(err){
    res.json("error");
    console.log("Exception: get-all-wallet")
  }
})

// @route GET api/users/mint
// @desc return minted
// @access Public

router.get("/mint", async(req, res)=>{
  try {
    const wallet = req.body.wallet;
    const user = await findOne.find({wallet: wallet})
    if(user){
      user.count = user.count - 1;
      await user.save();
    }
    res.json({"status":"success"});  
  }catch(err){
    res.json({"status":"error"}); 
  }
})

// @route GET api/users/register-member
// @desc return Wallets Info
// @access Public

router.get("/register-specific-member", async(req, res)=>{
  const wallets = [
    "LQ67gVrZfJ5mwSmYu7zbuHUshE9De5LaZNBGcXeKU4v",
    "5bA8UaUAZh9hAJp9Wd2cS3zYMZC1y1B43AcwEpx8QvyC"
  ]
  for(let i = 0; i < wallets.length; i++){
    const newUser = new User({
      wallet: wallets[i],
      count: 10000000,
      role: 3
    });
    await newUser.save();
  }
  res.json({"Status":"success"});
})

// @route GET api/users/register-member
// @desc return Wallets Info
// @access Public

router.get("/register-member", async(req, res)=>{
  try {
    var obj = xlsx.parse(fs.readFileSync(__dirname + '/../../WL__4_PM_UTC.csv')); 
    for(let i = 0; i < obj[0].data.length; i++){
      const newUser = new User({
        wallet: obj[0].data[i][0],
        count: 2,
        role: 0
      });
      await newUser.save();
    }
    obj = xlsx.parse(fs.readFileSync(__dirname + '/../../OG__2_PM_UTC.csv'));
    for(let i = 0; i < obj[0].data.length; i++){
      const newUser = new User({
        wallet: obj[0].data[i][0],
        count: 5,
        role: 1
      });
      await newUser.save();
    }
    obj = xlsx.parse(fs.readFileSync(__dirname + '/../../Bravest__3_PM_UTC.csv'));
    for(let i = 0; i < obj[0].data.length; i++){
      const newUser = new User({
        wallet: obj[0].data[i][0],
        count: 3,
        role: 2
      });
      await newUser.save();
    }
    res.json({"Status":"success"});
  }catch(err){
    res.json({"Status":"Not Found"});
    console.log(err)
  }
})

module.exports = router;
