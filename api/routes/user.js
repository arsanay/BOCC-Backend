const express = require("express");

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser'); // module for parsing cookies
var app = express();
app.use(cookieParser());
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
var jsonParser = bodyParser.json()
const router = express.Router();
//const checkAuth = require('../middleware/check-auth');

router.post("/signup", UserController.user_signup);

router.post("/login",jsonParser, UserController.user_login);

router.delete("/:userId", /*checkAuth,*/ UserController.user_delete);

router.get("/", UserController.data_all_user)
router.get('/logout', function (req, res, next) {
    res.clearCookie('boccAccessJwt');
    res.send('cookie cleared');
})
router.get('/checkAuth',checkAuth)

module.exports = router;