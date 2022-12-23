// tầng giao tiếp xử lý data
const userService = require('./service');
const bcrypt = require('bcryptjs');

exports.register = async (body) => {
    body.password = await bcrypt.hash(body.password, await bcrypt.genSalt(10));
    user = await userService.register(body);
    return { _id: user._id };
}

exports.deleteById = async (id) => {
    return await userService.delete(id);
}

exports.login = async (email, password) => {
    const user = await userService.findByEmail(email);
    if (!user) return 'Email không đúng!';
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return null;
    return user;
};

exports.findByEmail = async (email) => {
    return await userService.findByEmail(email);
};

exports.findByRole = async (role) => {
    return await userService.findByRole(role);
};

exports.findById = async (id) => {
    return await userService.findById(id);
};

exports.updateUser = async (id, body) => {
    return await userService.updateProfile(id, body);
};

exports.updatePassword = async (id, body) => {
    const data = await userService.findById(id);
    const password = await bcrypt.compare(body.passwordOld, data.password);
    if (!password){
        return null;
    }
    data.password = await bcrypt.hash(body.passwordNew, await bcrypt.genSalt(10));
    return await userService.updateProfile(data._id, data);
};