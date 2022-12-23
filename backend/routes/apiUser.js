const userController = require('../components/users/controller');
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
//middleware
const { isAuthenticatedUser } = require('../middleware/auth');

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

//Login User
router.post('/login', async function (req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await userController.login(email, password);
        if (user === 'Email không đúng!') {
            return res.status(200).json({
                message: user
            });
        } else {
            if (!user) {
                return res.status(200).json({
                    message: 'Mật khẩu không đúng'
                });
            } else {
                if (user.block) {
                    return res.status(200).json({
                        message: 'Tài khoản của bạn bị khóa!'
                    });
                } else {
                    const token = jwt.sign({ user: user }, 'DOANTOTNGHIEP');
                    const d = new Date();
                    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
                    let expires = "expires=" + d.toUTCString();
                    res.status(200).cookie("token", token, + expires).json({
                        "access_token": token,
                        "user": user
                    });
                }
            }
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

//Register User
router.post('/register', async function (req, res, next) {
    const { body } = req;
    body.image = 'http:/192.168.0.69:3000/images/image-1669710148885-709896471-avatar.jpg';
    const result = await userController.register(body);
    if (result) {
        res.status(200).json({ status: true });
    } else {
        res.status(200).json({ status: false });
    }
});

//Logout User
router.get('/logout', [isAuthenticatedUser], async function (req, res, next) {
    try {
        res.clearCookie('token').status(200).json({
            success: true,
            message: 'Đăng xuất thành công'
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.post('/update', async function (req, res, next) {
    const { body } = req;
    const user = await userController.updateUser(body._id, body);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ message: "Mật khẩu không đúng!" });
    }
});

//Get user Details
router.get('/profile/:id', [isAuthenticatedUser], async function (req, res, next) {
    const { id } = req.params;
    const user = await userController.findById(id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).json({ message: "Id not found" });
    }
});

router.post('/reset-password', async function (req, res, next) {
    const { body } = req;
    const user = await userController.updatePassword(body._id, body);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(200).json({ message: "Mật khẩu không đúng!" });
    }
});

router.post('/send-OTP', async function (req, res, next) {
    const { email } = req.body;
    let error = false;
    let message = '';
    const user = await userController.findByEmail(email);
    if (!user) {
        message = 'Không tìm thấy email này!'
        error = true
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
                message = 'Đã có lỗi xảy ra!'
                error = true
            } else {
                try {
                    user.OTP = OTP;
                    await userController.updateUser(user._id, user);
                    setTimeout(async () => {
                        user.OTP = "";
                        await userController.updateUser(user._id, user);
                    }, 15 * 60 * 1000);
                }
                catch {
                    message = 'Đã có lỗi xảy ra!'
                    error = true
                }
            }
        });
    }

    if (error === true) {
        res.status(200).json({ message: message });
    } else {
        res.status(200).json({ success: 'Gửi thành công' });
    }
});

router.post('/forgot-reset', async function (req, res, next) {
    const { body } = req;
    let error = false;
    let message = ''

    const user = await userController.findByEmail(body.email);
    if (body.OTP === user.OTP) {
        if (!user.OTP) {
            message = 'Đã xảy ra lỗi! Vui lòng gửi mail lại!'
            error = true
        } else {
            user.password = await bcrypt.hash(body.passwordNew, await bcrypt.genSalt(10));
            user.OTP = "";
            await userController.updateUser(user._id, user);
        }
    } else {
        message = 'OTP không đúng!'
        error = true
    }
    if (error === true) {
        res.status(200).json({ message: message });
    } else {
        res.status(200).json({ success: user });
    }
});

module.exports = router;