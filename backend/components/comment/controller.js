const commentService = require('./service');

exports.createComment = async (body) => {
    return await commentService.createComment(body);
}

exports.getByProductId = async (product_id) => {
    return await commentService.getByProductId(product_id);
}