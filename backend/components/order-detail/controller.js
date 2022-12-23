const orderService = require('./service');

exports.createOrder = async (body) => {
    return await orderService.createOrder(body);
}

exports.getOrderByUser = async (user_id) => {
    return await orderService.getOrderByUser(user_id);
}

exports.getOrderById = async (id) => {
    return await orderService.getOrderById(id);
}

exports.updateStatusOrder = async (id, body) => {
    return await orderService.updateStatusOrder(id, body);
}

exports.getAllOrder = async () => {
    return await orderService.getAllOrder();
}

exports.findByCustomer = async (name) => {
    return await orderService.findByCustomer(name);
}

exports.findByDelivering = async (delivering) => {
    return await orderService.findByDelivering(delivering);
}

exports.findByStatus = async (status) => {
    return await orderService.findByStatus(status);
}