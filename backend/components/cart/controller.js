const cartService = require('./service');

exports.createCart = async (body) => {
    const cart = await cartService.createCart(body);
    return cart;
}

exports.getCartByUser = async (user_id) => {
    const carts = await cartService.getCartByUser(user_id);
    return carts;
}

exports.getCartByUserIdAndProductId = async (user_id, product_id) => {
    const carts = await cartService.getCartByUserIdAndProductId(user_id, product_id);
    return carts;
}

exports.getCartById = async (id) => {
    const cart = await cartService.getCartById(id);
    return cart;
}

exports.deleteCart = async (id) => {
    const carts = await cartService.deleteCart(id);
    return carts;
}

//update
exports.updateCart = async (id, body) => {
    try {
        const cart = await cartService.updateCart(id, body);
        return cart;
    } catch (error) {
        return null;
    }
}