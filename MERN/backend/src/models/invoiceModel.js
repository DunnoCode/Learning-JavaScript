const mongoose = require('mongoose');
const User = require('./userModel');
const Music = require('./musicModel')

const invoiceSchema = new mongoose.Schema({
    full_name: {type: String, default: null, required: true},
    company_name: {type: String, default: null},
    address_1: {type: String, default: null, required: true},
    address_2: {type: String, default: null},
    city: {type: String, default: null, equired: true},
    region: {type: String, default: null},
    country: {type: String, default: null, required: true},
    postcode: {type: String, default: null, required: true},
    user_ref: { type: mongoose.ObjectId, ref: User },
    orderedMusics: [{ music_ref: {type: mongoose.ObjectId, ref: 'Music'}, music_name: {type: String, default: 0}, price: {type: Number, default: 0}, quantity: { type: Number, default: 0} }]
})

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice
