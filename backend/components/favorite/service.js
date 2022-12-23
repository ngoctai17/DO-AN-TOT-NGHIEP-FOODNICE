const favoriteModel = require('./model');

exports.createFavorite = async (favorite) => {
    return await favoriteModel.create(favorite);
}

exports.getByUserId = async (user_id) => {
    return await favoriteModel.find({ user_id: user_id }).populate('product_id');
}

exports.deleteFavoriteByUserIdAndProductId = async (user_id, product_id) => {
    return await favoriteModel.findOneAndDelete({ user_id : user_id, product_id: product_id });
}