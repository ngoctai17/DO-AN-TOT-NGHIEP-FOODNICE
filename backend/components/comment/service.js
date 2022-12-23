const commentModel = require('./model');

exports.createComment = async (comment) => {
    return await commentModel.create(comment);
}

exports.getByProductId = async (product_id) => {
    return await commentModel.find({ product_id: product_id}).populate('user_id');
}