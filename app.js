const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
app.use(cookieParser())
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const taskRoutes = require('./api/routes/tasks');
const config = {useNewUrlParser: true}
require('dotenv').config()

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('login');
});

app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(8081);
console.log('8081 is the magic port');

const DB_NAME = process.env.DB_NAME;
console.log(DB_NAME);
mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`,
    config,
);

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    if (req.method ==   'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUTS, POST, PATCH, DELETE');
    }   
    next();
});

//Routes which should handle any request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/products',productRoutes);
app.use('/orders',orderRoutes)
app.use('/user',userRoutes)
app.use('/task',taskRoutes)
app.use(morgan('dev'));


app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500 );
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports =  app  ;