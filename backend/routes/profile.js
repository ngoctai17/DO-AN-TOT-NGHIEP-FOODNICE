var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const userController = require('../components/users/controller');
const upload = require('../middleware/upLoad');
const { isLogin } = require('../middleware/auth');

//profile
router.get('/profile', [isLogin], async function (req, res, next) {
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('profile', {
        user: data.user, success: req.flash('success'),
        error: req.flash('error'), err: req.flash('err'), checkSendMail: req.flash('checkSendMail')
    });
});

router.post('/profile/:id/edit', [isLogin, upload.single('image')], async function (req, res, next) {
    let { body, file, params } = req;
    const user = await userController.findById(params.id);
    let image = user.image;
    let password = user.password;
    if (file) {
        image = `https://doantotnghiepfood.herokuapp.com/images/${file.filename}`;
    }
    body.password = password;
    body = { ...body, image };
    try {
        await userController.updateUser(params.id, body);
        req.flash('success', true);
    } catch {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/profile');
});

router.post('/profile/:id/editPassword', [isLogin, upload.single('image')], async function (req, res, next) {
    let { body, params } = req;
    // let { passwordOld, passwordNew } = req.body;
    try {
        if (!body.passwordOld && !body.passwordNew) {
            req.flash('error', 'Có lỗi sảy ra!');
        } else {
            await userController.updatePassword(params.id, body);
            req.flash('success', true);
        }
    } catch {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/profile');
});

router.post('/accuracy/:email', async function (req, res, next) {
    const { OTP } = req.body;
    let { email } = req.params;
    // email = email.substring(1);
    const user = await userController.findByEmail(email);
    console.log(email)
    if (OTP === user.OTP) {
        if (!user.OTP) {
            req.flash('err', 'Đã xảy ra lỗi! Vui lòng gửi mail lại');
            req.flash('checkSendMail', true)
            res.redirect('/profile');
        } else {
            user.statusEmail = true;
            user.OTP = '';
            await userController.updateUser(user._id, user);
            req.flash('success', true);
            res.redirect('/profile');
        }
    } else {
        req.flash('err', 'OTP không đúng!');
        req.flash('checkSendMail', true)
        res.redirect('/profile');
    }
});


module.exports = router;
