const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catalog = new Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 50},
    description: {type: String, required: true, minlength: 3, maxlength: 500},
    products: [{type: Schema.Types.ObjectId, ref: 'product'}]
},
{
    timestamps: true
});

module.exports = mongoose.model('catalog', catalog);