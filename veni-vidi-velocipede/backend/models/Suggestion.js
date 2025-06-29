const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Novos Modelos', 'Feedback sobre Produtos', 'Melhorias no Site'],
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    response: {
        type: String,
        default: null,
        maxlength: 1000,
        trim: true
    }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);