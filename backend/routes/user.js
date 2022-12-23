var express = require('express');
var router = express.Router();
const userController = require('../components/users/controller');
const upload = require('../middleware/upLoad');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { isLogin, isAdmin } = require('../middleware/auth');

//setting send email
const OTP = Math.floor(Math.random() * 100) + 1000;
var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'doantotnghiepfoodnice@gmail.com',
        pass: 'xyphkzkkrnedrbtt'
    },
    tls: {
        rejectUnauthorized: false
    }
});

//alert loi
router.get('/alert', function (req, res, next) {
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('alert', { user: data.user });
});

//login
router.get('/', function (req, res, next) {
    res.render('login', {});
});
router.get('/login', function (req, res, next) {
    res.render('login', { error: req.flash('error') });
});

router.post("/login", async function (req, res, next) {
    try {
        const { email, password } = req.body;
        let user = await userController.login(email, password);
        console.log(user)
        if (user.role == 'Admin' || user.role == 'Mod') {
            user.password = '';
            const token = jwt.sign({ user: user }, 'DOANTOTNGHIEP');

            const d = new Date();
            d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            res.cookie("token", token, + expires);
            res.redirect("/home");
        } else {
            req.flash('error', true);
            res.redirect("/login");
        }
    } catch (error) {
        req.flash('error', true);
        res.redirect("/login");
    }
});

//register
router.get('/register', [isLogin, isAdmin], function (req, res, next) {
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('register-user', { user: data.user, success: req.flash('success'), error: req.flash('error') });
});

router.post('/register-user', [isLogin, upload.single('image')], async function (req, res, next) {
    let { body, file } = req;
    let image = 'https://doantotnghiepfood.herokuapp.com/image-1669710148885-709896471-avatar.jpg';
    if (file) {
        image = `https://doantotnghiepfood.herokuapp.com/images/${file.filename}`;
    }
    body.role = 'Mod';
    body = { ...body, image };
    try {
        if (body.email && body.password) {
            await userController.register(body);
            req.flash('success', true);
        } else {
            req.flash('error', 'Vui lòng nhập đủ thông tin');
        }
    } catch {
        req.flash('error', 'Có lỗi sảy ra!');
    }
    res.redirect('/register');
});

//list
router.get("/list-admin", [isLogin, isAdmin], async function (req, res, next) {
    const users = await userController.findByRole('Mod');
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render("list-admin", { users: users, user: data.user });
});

//list
router.get("/list-user", [isLogin, isAdmin], async function (req, res, next) {
    const users = await userController.findByRole('User');
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render("list-user", { users: users, user: data.user });
});

//delete
router.get('/user/:id/delete', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    await userController.deleteById(id);
    res.redirect('/list-admin');
});

router.get('/user/:id/block', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    let user = await userController.findById(id);
    user.block = true;
    await userController.updateUser(id, user);
    res.redirect('/list-user');
});

router.get('/user/:id/unlock', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    let user = await userController.findById(id);
    user.block = false;
    await userController.updateUser(id, user);
    res.redirect('/list-user');
});

//logout
router.get('/logout', function (req, res, next) {
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', { expires: new Date(0) });
    }
    res.redirect('/login');
});

//send mail
router.get('/send', function (req, res, next) {
    res.render('send-mail', { error: req.flash('error') });
});

router.post('/send', async function (req, res, next) {
    const { email } = req.body;
    const user = await userController.findByEmail(email);
    if (!user) {
        req.flash('error', true);
        res.redirect('/send');
    } else {
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Developer Web FoodNice',
            to: email,
            subject: 'Đổi mật khẩu',
            text: 'Reset password' + req.body.email,
            html: '<p>Mã xác minh của bạn là:' + OTP + '</li><li>Mã có hiêu lực trong 15p' + '</li><li>Không chia sẻ mã nàu với bất kì ai ' + '</li></ul>'
        }
        transporter.sendMail(mainOptions, async function (err, info) {
            if (err) {
                req.flash('error', true);
                res.redirect('/send');
            } else {
                try {
                    user.OTP = OTP;
                    await userController.updateUser(user._id, user);
                    setTimeout(async () => {
                        user.OTP = "";
                        await userController.updateUser(user._id, user);
                    }, 15 * 60 * 1000);
                    console.log('Message sent: ' + info.response);
                    res.redirect('/reset-password/:' + email);
                }
                catch {
                    req.flash('error', true);
                    res.redirect('/send');
                }
            }
        });

    }
});

//reset password
router.get('/reset-password/:email', function (req, res, next) {
    const { email } = req.params;
    res.render('reset-password', { email: email, error: req.flash('error'), success: req.flash('success') });
});

router.post('/reset-password/:email', async function (req, res, next) {
    const { body } = req;
    let { email } = req.params;
    let success = false;
    email = email.substring(1);
    const user = await userController.findByEmail(email);
    if (body.OTP === user.OTP) {
        if (!user.OTP) {
            req.flash('error', 'Đã xảy ra lỗi! Vui lòng gửi mail lại');
        } else {
            if (body.passwordNew !== body.passwordChange) {
                req.flash('error', 'Nhập lại mật khẩu không đúng');
            } else {
                user.password = await bcrypt.hash(body.passwordNew, await bcrypt.genSalt(10));
                user.OTP = "";
                await userController.updateUser(user._id, user);
                success = true;
            }
        }
    } else {
        req.flash('error', 'OTP không đúng!');
    }
    if (success) {
        req.flash('success', true);
        res.redirect('/reset-password/:' + email);
    } else {
        res.redirect('/reset-password/:' + email);
    }
});

router.get('/accuracy/:email', async function (req, res, next) {
    const { email } = req.params;
    const user = await userController.findByEmail(email);
    if (!user) {
        req.flash('error', true);
        res.redirect('/send');
    } else {
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Developer Web FoodNice',
            to: email,
            subject: 'Xác thực email',
            text: 'Xác thực email' + req.body.email,
            html: '<p>Mã xác minh của bạn là:' + OTP + '</li><li>Mã có hiêu lực trong 15p' + '</li><li>Không chia sẻ mã nàu với bất kì ai ' + '</li></ul>'
        }
        transporter.sendMail(mainOptions, async function (err, info) {
            if (err) {
                req.flash('err', false)
                res.redirect('/profile');
            } else {
                try {
                    user.OTP = OTP;
                    await userController.updateUser(user._id, user);
                    setTimeout(async () => {
                        user.OTP = "";
                        await userController.updateUser(user._id, user);
                    }, 15 * 60 * 1000);
                    req.flash('checkSendMail', true)
                    res.redirect('/profile');
                }
                catch {
                    req.flash('err', false)
                    res.redirect('/profile');
                }
            }
        });

    }
});

module.exports = router;
