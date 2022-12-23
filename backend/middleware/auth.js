const jwt = require("jsonwebtoken");
const User = require("../components/users/model");

// Check if user is authenticated
exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Bạn chưa đăng nhập",
        });
    }
    try {
        var user = jwt.verify(token, 'DOANTOTNGHIEP');
        req.user = await User.findById(user._id);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Bạn chưa đăng nhập",
        });
    }
}

//for web server
exports.isLogin = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        res.redirect('/login');
    }else {
        var user = jwt.verify(token, 'DOANTOTNGHIEP');
        if (!user){
            res.redirect('/login');
        }else {
            next();
        }

    }
}

exports.isAdmin = async (req, res, next) => {
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    console.log(data.user.role)
    if (data.user.role === 'Admin') {
        res.data = data.user;
        next();
    }else {
        res.redirect('/alert')
    }
}