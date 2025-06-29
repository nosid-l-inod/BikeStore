const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    priceWithoutVAT: {
        type: Number,
        required: true
    },
    vat: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Montanha', 'Estrada', 'Urbana', 'Elétrica'],
        required: true
    }
});

productSchema.pre('save', function(next) {
    this.priceWithoutVAT = (this.price / 1.23).toFixed(2);
    this.vat = (this.price - this.priceWithoutVAT).toFixed(2);
    next();
});

module.exports = mongoose.model('Product', productSchema);