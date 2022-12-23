const discountModel = require('./model');

//Tạo mới một discount
exports.createDiscount = async (discount) => {
    await discountModel.create(discount);
}

exports.getAll = async () => {
    return await discountModel.find().populate('category_id').populate('product_id');
}

exports.getByDiscount = async (discount) => {
    return await discountModel.findOne({ discount: discount});
}

exports.getById = async (id) => {
    return await discountModel.findById(id).populate('category_id').populate('product_id');
}

exports.updateDiscount = async (id, discount) => {
    return await discountModel.findByIdAndUpdate(id, discount)
}

//delete category
exports.deleteDiscount = async (id) => {
    return await discountModel.findByIdAndDelete(id);
}