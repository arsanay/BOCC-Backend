const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')

const UserController = require('../controllers/user');
var jsonParser = bodyParser.json()
//const checkAuth = require('../middleware/check-auth');

router.post("/signup", UserController.user_signup);

router.post("/login",jsonParser, UserController.user_login);

router.delete("/:userId", /*checkAuth,*/ UserController.user_delete);

router.get("/", UserController.data_all_user)

module.exports = router;