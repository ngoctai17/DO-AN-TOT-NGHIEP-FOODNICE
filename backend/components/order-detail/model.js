const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    cart_id: [
        {
            type: Schema.Types.ObjectId,
            ref: "order"
        }
    ],
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    customer: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: Number
    },
    totals: {
        type: Number
    },
    date: {
        type: Date,
        default: new Date()
    },
    status: {
        type: Boolean
    },
    delivering: {
        type: String,
        default: "Đang xử lý"
    },
    discount: {
        type: Number
    }
});

module.exports = mongoose.model('order-detail', orderDetailSchema);
