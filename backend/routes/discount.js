var express = require('express');
var router = express.Router();
const discountController = require('../components/discount/controller');
const productController = require('../components/products/controller');
const categoryController = require('../components/category/controller');
const jwt = require('jsonwebtoken');
////middleware 
const { isLogin } = require('../middleware/auth');

router.get('/add-discount', [isLogin], async function (req, res, next) {
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    const categories = await categoryController.getAllCategory();
    const products = await productController.getAllProducts();
    res.render('add-discount', {
        user: data.user,
        success: req.flash('success'),
        error: req.flash('error'),
        categories: categories,
        products: products
    });
});

router.post('/add-discount', [isLogin], async function (req, res, next) {
    try {
        const { body } = req;
        if (body.isAll === 'true') {
            body.all = true;
            delete body.category_id;
            delete body.product_id;
            delete body.isAll;
            delete body.isCate;
            delete body.isProduct;
        }
        if (body.isCate === 'true') {
            delete body.product_id;
            delete body.isAll;
            delete body.isCate;
            delete body.isProduct;
        }
        if (body.isProduct === 'true') {
            delete body.category_id;
            delete body.isAll;
            delete body.isCate;
            delete body.isProduct;
        }
        await discountController.createDiscount(body);
        req.flash('success', true);
    } catch (e) {
        console.log(e)
        req.flash('error', 'Có lỗi xảy ra');
    }
    res.redirect('/add-discount');
});

router.get('/list-discount', [isLogin], async function (req, res, next) {
    let discounts = await discountController.getAll();
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('list-discount', {
        discounts: discounts,
        user: data.user, success: req.flash('success')
    });
});

router.get('/delete-discount/:id', [isLogin], async function (req, res, next) {
    let { id } = req.params;
    try {
        await discountController.deleteDiscount(id);
    } catch {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/list-discount');
});

//edit
router.post('/edit-discount/:id', [isLogin], async function (req, res, next) {
    try {
        const { id } = req.params;
        const { body } = req;
        if (body.isAll === 'true') {
            body.all = true;
            body.category_id = null;
            body.product_id = null;
            delete body.isAll;
            delete body.isCate;
            delete body.isProduct;
        }
        if (body.isCate === 'true') {
            body.product_id = null;
            body.all = false;
            delete body.isAll;
            delete body.isCate;
            delete body.isProduct;
        }
        if (body.isProduct === 'true') {
            body.category_id = null;
            body.all = false;
            delete body.isAll;
            delete body.isCate;
            delete body.isProduct;
        }
        const data =  await discountController.updateDiscount(id, body);
        console.log(data)
        req.flash('success', true);
    } catch (e) {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/list-discount');
});

router.get('/edit-discount/:id', [isLogin], async function (req, res, next) {
    let { id } = req.params;
    try {
        const { token } = req.cookies;
        var data = jwt.verify(token, 'DOANTOTNGHIEP');
        const discount = await discountController.getById(id);
        const categories = await categoryController.getAllCategory();
        const products = await productController.getAllProducts();
        if (discount.category_id) {
            const categoryNew = categories.filter(function (item) {
                return item.name != discount.category_id.name;
            })
            res.render('update-discount', {
                discount: discount,
                user: data.user,
                categories: categoryNew,
                products: products
            })
        }
        if (discount.product_id){
            const productNew = products.filter(function (item) {
                return item.name != discount.product_id.name;
            })
            res.render('update-discount', {
                discount: discount,
                user: data.user,
                categories: categories,
                products: productNew
            })
        }
        if (discount.all){
            res.render('update-discount', {
                discount: discount,
                user: data.user,
                categories: categories,
                products: products
            })
        }
    } catch {

    }
});


module.exports = router;
