const productModel = require('./model');

//create a new product
exports.createProduct = async (productBody) => {
    return await productModel.create(productBody);
}

//get all products
exports.getAllProducts = async () => {
    return await productModel.find().populate('category_id', 'name -_id');
}

exports.getAllProductsTrue = async () => {
    return await productModel.find({ 'status': true }).populate('category_id', 'name -_id');
}

exports.getAllProductsTrueByCategory = async (id) => {
    return await productModel.find({ 'status': true, 'category_id': id }).populate('category_id', 'name -_id');
}

//get all products by category
exports.getProductByCategory = async (id) => {
    return await productModel.find({ 'category_id': id }).populate('category_id', 'name -_id');
}

//get a single product
exports.getSingleProduct = async (id) => {
    return await productModel.findById(id).populate('category_id');
}

//get count of products
exports.getCountProduct = async () => {
    return await productModel.countDocuments();
}

//update product
exports.updateProduct = async (productId, productBody) => {
    return await productModel.findByIdAndUpdate(productId, productBody, { new: true });
}

//delete product
exports.deleteProduct = async (productId) => {
    return await productModel.findByIdAndDelete(productId);
}

//get the latest five products
exports.getLatestProducts = async () => {
    return await productModel.find().sort({ totals: -1 }).limit(5);
}

exports.findByName = async (name) => {
    return await productModel.find({ name : new RegExp(name, 'i')}).populate('category_id', 'name -_id');
}

//get the latest five products
exports.getTop5Product = async () => {
    return await productModel.find().sort({ quantity_purchased: -1 }).limit(5);
}