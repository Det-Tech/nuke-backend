const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors')
const xlsx = require('node-xlsx');
const fs = require('fs');

const users = require("./routes/api/users");
// models
const User = require("./models/User");

const app = express();
app.use(cors())
app.use(express.static(__dirname + '/'));

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: true, //this is the code I added that solved it all
  keepAlive: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  useFindAndModify: false,
  useUnifiedTopology: true
}
// Connect to MongoDB
mongoose
  .connect(
    db,
    options
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));

const main = async()=>{
    console.log("Registering..")
    var obj = xlsx.parse(fs.readFileSync(__dirname + '/WL__4_PM_UTC.csv')); // parses a buffer
    for(let i = 0; i < obj[0].data.length; i++){
      const newUser = new User({
        wallet: obj[0].data[i][0],
        count: 2,
        role: 0
      });
      await newUser.save();
    }
    obj = xlsx.parse(fs.readFileSync(__dirname + '/OG__2_PM_UTC.csv')); // parses a buffer
    for(let i = 0; i < obj[0].data.length; i++){
      const newUser = new User({
        wallet: obj[0].data[i][0],
        count: 5,
        role: 1
      });
      await newUser.save();
    }
    obj = xlsx.parse(fs.readFileSync(__dirname + '/Bravest__3_PM_UTC.csv')); // parses a buffer
    for(let i = 0; i < obj[0].data.length; i++){
      const newUser = new User({
        wallet: obj[0].data[i][0],
        count: 3,
        role: 2
      });
      await newUser.save();
    }
    console.log("Registered successfully.")
}

// main();
module.exports.app = app;

