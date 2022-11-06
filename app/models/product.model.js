const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    catalogId: { type: Schema.Types.ObjectId, ref: 'Catalog' },
    name: {type: String, required: true, minlength: 3, maxlength: 50},
    price: {type: Number, required: true},
    cost: {type: Number, required: true},
    active: {type: Boolean, reqiore: true, default: true},
    description: {type: String, minlength: 3, maxlength: 500},
    images: {type: [{type: String}], required: true, default: []},
    unit: {type: String},
    weightPerUnit: {type: Number, min: 0, max: 1000000000},
},
{
    timestamps: true
});

module.exports = mongoose.model('product', product);