const mongoose = require('mongoose')
const Schema = mongoose.Schema


let userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    phone: {
        type: Number,
        min: 9
    },
    savedPets: {
        type: Array,
        default: []
    },
    adoptPets: {
        type: Array,
        default: []
    },
    fosterPets: {
        type: Array,
        default: []
    },
    bio: {
        type: String,
    },
    admin: {
        type: Number,
        default: 1
    }
})

let User = mongoose.model('User', userSchema)

module.exports = User