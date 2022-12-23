const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "products"
    },
});

module.exports = mongoose.model('comment', commentSchema);
