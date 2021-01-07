const mongoose = require('mongoose')
const Schema = mongoose.Schema

let petSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        require: true,
    },
    color: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    adoption: {
        type: Number,
        default: 3,
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    hypo: {
        type: Boolean,
        default: false
    },
    diet: {
        type: String
    },
    images: {
        type: Array
    },
    adoptId: {
        type: String
    },
    fosterId: {
        type: String
    },
})

let Pet = mongoose.model('Pet', petSchema)
module.exports = Pet