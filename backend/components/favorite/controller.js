const favoriteService = require('./service');

exports.createFavorite = async (body) => {
    return await favoriteService.createFavorite(body);
}

exports.getByUser = async (user_id) => {
    return await favoriteService.getByUserId(user_id);
}

exports.deleteFavoriteByUserIdAndProductId = async (user_id, product_id) => {
    return await favoriteService.deleteFavoriteByUserIdAndProductId(user_id, product_id);
}