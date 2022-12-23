const discountService = require('./service');

exports.createDiscount = async (body) => {
    return await discountService.createDiscount(body);
}

exports.getAll = async () => {
    return await discountService.getAll();
}

exports.getByDiscount = async (discount) => {
    return await discountService.getByDiscount(discount);
}

exports.getById = async (id) => {
    return await discountService.getById(id);
}

exports.updateDiscount = async (id, body) => {
    return await discountService.updateDiscount(id, body);
}

//delete category
exports.deleteDiscount = async (id) => {
    return await discountService.deleteDiscount(id);
}