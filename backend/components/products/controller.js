const productService = require('./service');

//create a new product
exports.createProduct = async (body) => {
    await productService.createProduct(body);
}

//get all products
exports.getAllProducts = async (req, res) => {
    const data = await productService.getAllProducts();
    return data;
}

//get all products
exports.getAllProductsTrue = async (req, res) => {
    const data = await productService.getAllProductsTrue();
    return data;
}

exports.findByName = async (name) => {
    return await productService.findByName(name);
}

//update product
exports.updateProduct = async (id, product) => {
    return await productService.updateProduct(id, product);
}

//delete product
exports.deleteProduct = async (id) => {
    await productService.deleteProduct(id);
}

//get ByIdProduct
exports.getByIdProduct = async (id) => {
    const product = await productService.getSingleProduct(id);
    return product;
}

exports.getProductByCategory = async (id) => {
    const product = await productService.getProductByCategory(id);
    return product;
}

exports.getTop5Product = async () => {
    const product = await productService.getTop5Product();
    return product;
}

exports.getAllProductsTrueByCategory = async (id) => {
    const products = await productService.getAllProductsTrueByCategory(id);
    return products;
}