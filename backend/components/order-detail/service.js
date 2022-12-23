const orderModel = require('./model');

//Tạo mới
exports.createOrder = async (order) => {
    return await orderModel.create(order);
}

//get cart by user
exports.getOrderByUser = async (user_id) => {
    const orders = await orderModel.find({ user_id: user_id }).sort({ 'date': -1 });
    return orders;
}

//get cart by id
exports.getOrderById = async (id) => {
    return await orderModel.findById(id);
}

//get all
exports.getAllOrder = async (req, res) => {
    return await orderModel.find().sort({ 'date': -1 }).populate('user_id', 'name -_id');
}

//update
exports.updateStatusOrder = async (id, body) => {
    return await orderModel.findByIdAndUpdate(id, body, { new: true });
}

exports.findByCustomer = async (name) => {
    return await orderModel.find({ customer: new RegExp(name, 'i') }).populate('user_id', 'name -_id');
}

exports.findByDelivering = async (delivering) => {
    return await orderModel.find({ delivering: delivering }).sort({ 'date': -1 }).populate('user_id', 'name -_id');
}

exports.findByStatus = async (status) => {
    return await orderModel.find({ status: status }).sort({ 'date': -1 }).populate('user_id', 'name -_id');
}