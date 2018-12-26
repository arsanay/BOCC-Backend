const jwt = require("jsonwebtoken");
var express = require("express");
var cookieParser = require("cookie-parser");
var app = express();
app.use(cookieParser());
const ENV = require("dotenv").config();
JWT_KEY = process.env.JWT_KEY;
// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, JWT_KEY);
//     console.log(token)
//     req.userData = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       message: "Auth failed"
//     });
//   }
// };

module.exports = function(req, res, next) {
  try {
    const userJWT = req.cookies.boccAccessJwt;
    console.log(userJWT)
    if (!userJWT) {
      console.log("Invalid or missing auth token");
      return res.status(401, "Invalid or missing auth token");
    } else {
      const userJWTPayload = jwt.verify(userJWT, JWT_KEY);
      if (!userJWTPayload) {
        console.log("Invalid or missing authorization token");
        // res.clearCookie("BOCCAccessJwt");
        return res.status(401).json({
          message: "Invalid or missing authorization token sa"
        });
      } else {
        //3. There's a valid token...see if it is one we have in the db as a logged-in user
        //
        const token = req.cookies.boccAccessJwt;
        const decoded = jwt.verify(token, JWT_KEY);
        req.userData = decoded;
        console.log("masuk ke sukses")
        return res.status(200).json({
          status: "Success",
          uid: decoded.userId
        });
      }
    }
  } catch (error) {
    console.log("Auth failed");
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};
