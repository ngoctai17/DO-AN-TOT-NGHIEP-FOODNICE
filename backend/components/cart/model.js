const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    quantity: {
        type: Number,
    },
    status: {
        type: Boolean,
    },
});

module.exports = mongoose.model('cart', cartSchema);
