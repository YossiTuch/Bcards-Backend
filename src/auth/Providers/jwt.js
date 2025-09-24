const jwt = require("jsonwebtoken");
require("dotenv").config();

const key = process.env.JWT_KEY;
console.log(key)

const generateAuthToken = user => {
  const { _id, isAdmin, isBusiness } = user;
  const token = jwt.sign({ _id, isAdmin, isBusiness }, key);
  return token;
};

const verifyToken = token => {
  try {
    const userData = jwt.verify(token, key);
    return userData;
  } catch (error) {
    return null;
  }
};

exports.generateAuthToken = generateAuthToken;
exports.verifyToken = verifyToken;
