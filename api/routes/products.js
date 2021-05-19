const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

//handle incoming GET requests to /orders
router.get('/', (req, res, next)=>{ //handles get requests
    Product.find()      //funcion para encontrar todo
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://locahost:3000/products/' +doc._id
                    }
                }
            })
        }
        res.status(200).json({response});
        /* if(docs.length >= 0){
            res.status(200).json({docs});
        }
        else{
            res.status(404).json({
                message: 'not entries found'
            });
        } */
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }) 
})

router.post('/', (req, res, next)=>{  //handles post requests
   // console.log("paco")
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'created product sucessfully ',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://locahost:3000/products/' + result._id
                }

            }
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:productId', (req, res, next)=>{  //using params
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc=>{
        console.log("from database: ", doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'GET_ALL',
                    url: 'http://localhost:3000/products/'
                }
            });
        }else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });
})

router.patch('/:productId', (req, res, next)=>{  //using params
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
})

router.delete('/:productId', (req, res, next)=>{  //using params
    const id = req.params.productId
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    });
})

module.exports= router;