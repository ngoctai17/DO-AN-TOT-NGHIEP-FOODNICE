const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema({
    title: {
        type: String,
    },
    discount: {
        type: String
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: "category"
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    quantity: {
        type: Number
    },
    percent: {
        type: Number
    },
    all: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('discount', discountSchema);
