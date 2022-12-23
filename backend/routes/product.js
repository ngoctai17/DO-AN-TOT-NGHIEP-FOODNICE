var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upLoad');
const productController = require('../components/products/controller');
const categoryController = require('../components/category/controller');
//middleware
const { isLogin } = require('../middleware/auth');

//list
router.get("/list-product", [isLogin], async function (req, res, next) {
    const products = await productController.getAllProducts();
    let productsList = [];
    for (let product of products) {
        const money = product.price;
        const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9}
        const formated = new Intl.NumberFormat('vi-VN', config).format(money);
        productsList.push({
            product: product,
            productPrice: formated
        })
    }
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render("list-product", { products: productsList, user: data.user, success: req.flash('success') });
});

//add
router.get('/addproduct', [isLogin], async function (req, res, next) {
    const categories = await categoryController.getAllCategory();
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('add-product', { categories: categories, user: data.user,
        success: req.flash('success'), error: req.flash('error') });
});

router.post('/addproduct', [isLogin, upload.single('image')], async function (req, res, next) {
    let { body, file } = req;
    let image = '';
    if (file) {
        image = `https://doantotnghiepfood.herokuapp.com/images/${file.filename}`;
    }
    body.status = true;
    body = { ...body, image };
    try {
        if(body.name && body.price && body.quantity && body.category_id){
            await productController.createProduct(body);
            req.flash('success', true);
        }else {
            req.flash('error', 'Vui lòng nhập đủ thông tin');
        }     
    }catch {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/addproduct');
});

//edit
router.get('/product/:id/edit', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    const product = await productController.getByIdProduct(id);
    const categories = await categoryController.getAllCategory();
    const category = await categoryController.getCategoryById(product.category_id);
    const categorynew = categories.filter(function (item) {
        return item.name != category.name;
    })
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('update-product', { product: product, category: categorynew, 
        categoryget: category, user: data.user });
});

router.post('/product/:id/edit', [isLogin, upload.single('image')], async function (req, res, next) {
    let { body, file, params } = req;
    const product = await productController.getByIdProduct(params.id);
    let image = product.image;
    if (file) {
        image = `https://doantotnghiepfood.herokuapp.com/images/${file.filename}`;
    }
    body = { ...body, image };
    try {
        await productController.updateProduct(params.id, body);
            req.flash('success', true);   
    }catch {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/list-product');
});

//delete
router.get('/product/:id/delete', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    await productController.deleteProduct(id);
    res.redirect('/list-product');
});

router.get('/product/setStatus/:id', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    let product = await productController.getByIdProduct(id);
    if(product.status === true){
        product.status = false;
    }else {
        product.status = true;
    }
    await productController.updateProduct(id, product);
    res.redirect('/list-product');
});

//search
router.post('/search', [isLogin], async function (req, res, next) {
    const { name } = req.body;
    const products = await productController.findByName(name);
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render("list-product", { products: products, user: data.user });
});

//getAllProductByCategory
router.get('/getProductByCateId/:id', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    const products = await productController.getProductByCategory(id);
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render("list-product", { products: products, user: data.user });
});

module.exports = router;
