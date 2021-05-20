const mongoose = require('mongoose');

//definir el modelo que usara la base de datos
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    productImage: {type: String, require:true}
});

module.exports = mongoose.model('Products', productSchema);