const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: ""
    },
    OTP: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "User"
    },
    statusEmail: {
        type: Boolean,
        default: false
    },
    block: {
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model("user", userSchema);
