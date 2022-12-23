const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    image: { type: String, default: "" }
});

module.exports = mongoose.model('category', categorySchema);
