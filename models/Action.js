const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let actionSchema = new Schema({
    userName: {
        type: String,
    },
    petName: {
        type: String,
    },
    petId: {
        type: String,
    },
    action: {
        type: String,
    },
    time: {
        type: Date,
        default: Date.now
    },
});

let Action = mongoose.model("Action", actionSchema);

module.exports = Action;
