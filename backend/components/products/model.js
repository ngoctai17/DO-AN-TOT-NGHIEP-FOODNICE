const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number
    },
    image: { type: String},

    description: {
        type: String
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: "category"
    },
    status: {
        type: Boolean
    },
    quantity_purchased:{
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("product", productSchema);
