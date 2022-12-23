var express = require('express');
var router = express.Router();
const categoryController = require('../components/category/controller');
const upload = require('../middleware/upLoad');
const jwt = require('jsonwebtoken');
////middleware 
const { isLogin } = require('../middleware/auth');

//list
router.get('/list-category', [isLogin],  async function (req, res, next) {
    const categories = await categoryController.getAllCategory();
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('list-category', { categories: categories, user: data.user, success: req.flash('success') });
});

//add
router.get('/addcategory', [isLogin],  async function (req, res, next) {
    let categories = await categoryController.getAllCategory();
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('add-category', { categories: categories, 
        user: data.user, success: req.flash('success'), error: req.flash('error') });
});

router.post('/addcategory',  [isLogin, upload.single('image')], async function (req, res, next) {
    let { body, file } = req;
    if (body){
        let image = '';
    if (file) {
        image = `https://doantotnghiepfood.herokuapp.com/images/${file.filename}`;
    }
    body = { ...body, image };
    }
    try {
        if(body.name && body.image){
            await categoryController.createCategory(body);
            req.flash('success', true);
        }else {
            req.flash('error', 'Vui lòng nhập đủ thông tin');
        }     
    }catch {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/addcategory');
});

//edit
router.get('/category/:id/edit', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    const category = await categoryController.getCategoryById(id);
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('update-category', { category: category, user: data.user, success: req.flash('success') });
});

router.post('/category/:id/edit', [isLogin, upload.single('image')], async function (req, res, next) {
    let { body, file, params } = req;
    const category = await categoryController.getCategoryById(params.id);
    let image = category.image;
    if (file) {
        image = `https://doantotnghiepfood.herokuapp.com/images/${file.filename}`;
    }
    body = { ...body, image };
    try {
        await categoryController.updateCategory(params.id, body);
            req.flash('success', true);   
    }catch {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/list-category');
});

//delete
router.get('/category/:id/delete', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    await categoryController.deleteCategory(id);
    res.redirect('/list-category');
});


module.exports = router;
