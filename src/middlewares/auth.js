const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config()

const userAuth = async (req, res, next) => {
  try {

    let newToken=""

    const { token } = req.cookies;

    console.log(" aa: ", token)

    if(!token){
      if(req?.headers?.authorization){
        newToken = req?.headers?.authorization?.split(' ')[1];
        if(!newToken) return res.status(401).send("Please Login!");
      }
    }

    
    if(!token&&!newToken){
      return res.status(401).send("Please Login!");
    }

    if(token){
      newToken=token
    }

    // newToken=token

    const decodedObj = await jwt.verify(newToken, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
