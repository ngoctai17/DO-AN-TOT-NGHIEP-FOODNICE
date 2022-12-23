const cartModel = require('./model');

//Tạo mới một category
exports.createCart = async (cart) => {
    return await cartModel.create(cart);
}

//Tạo mới một category
exports.deleteCart = async (id) => {
    return await cartModel.findByIdAndDelete(id);
}

//get cart by user
exports.getCartByUser = async (user_id) => {
    return await cartModel.find({ user_id : user_id, status: false }).populate('product_id', '-_id -quantity -category_id');
}

//get cart by user
exports.getCartByUserIdAndProductId = async (user_id, product_id) => {
    return await cartModel.findOne({ user_id : user_id, status: false, product_id: product_id }).populate('product_id', '-_id -quantity -category_id');
}

//get cart by user
exports.getCartById = async (id) => {
    return await cartModel.findById(id).populate('product_id');
}

//update category
exports.updateCart = async (id, cart) => {
    return await cartModel.findByIdAndUpdate(id, cart, { new: true })
}