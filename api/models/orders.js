const mongoose = require('mongoose');

//definir el modelo que usara la base de datos
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',//igual al nombre que tienes en el export del modelo products
        required: true
    },
    quantity:{type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);