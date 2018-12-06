const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bodyParser = require('body-parser');


const JWT_KEY = process.env.JWT_KEY;

exports.data_all_user = exports.user_signup = (req, res, next) => {
  User.find()
  .select("email password")
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        return {
          email: doc.email,
          password: doc.password,
          _id: doc._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + doc._id
          }
        };
      })
    };
    //   if (docs.length >= 0) {
    res.status(200).json(response);
    //   } else {
    //       res.status(404).json({
    //           message: 'No entries found'
    //       });
    //   }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.user_signup = (req, res, next) => {
 // console.log(req.body)
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
     
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              firstName: req.body.firstName,
              lastName: req.body.lastName
            });
            console.log(user)
            user
              .save()
              .then(result => {
            //    console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  console.log(req.body)
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        console.log(user.length)
       
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};