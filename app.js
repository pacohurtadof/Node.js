const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require ('./api/routes/products'); 
const ordersRoutes = require ('./api/routes/orders'); 

mongoose.connect("mongodb+srv://dbUser:"+env.MONGO_ATLAS_PW+ "@node-rest-shop.bjqp0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    
    "useNewUrlParser": true,
    "useUnifiedTopology": true
})
.then(res => console.log("Connected to DB"))
.catch(err => console.log("err ",err))//necesita esto porque es promesa
mongoose.Promise = global.Promise;


app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})) //aqui iba bodyparser.urlencoded pero ya es deprecated, se incluyo en express
app.use(express.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //evitar errores CORS. el * es a quién le quieres dar acceso, se puede cambiar por un dominio
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
        //res.end()
        return res.status(200).json({});
    }
    //res.end(); //añadido por mí porque dejaba los headers abiertos
    next()
});

//Routes which should handle requests
app.use('/products', productRoutes); //middleware. Toma el primer argumento (la ruta) como filtro
app.use('/orders', ordersRoutes); //middleware. Toma el primer argumento (la ruta) como filtro


//for all errors
app.use((req, res, next)=>{
    const error = new Error('Not found')
    error.status= 404;
    next(error)
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app;