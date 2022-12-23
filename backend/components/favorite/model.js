const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
});

module.exports = mongoose.model('favorite', favoriteSchema);
