// tầng giao tiếp với database
const userModel = require('./model');

exports.register = async (userBody) => {
    const user = await userModel.findOne({ email: userBody.email })
    if (user){
        throw new Error('Email đã tồn tại');
    }
    return await userModel.create(userBody);
}

exports.findByEmail = async (email) => {
    const user = await userModel.findOne({ email: email });
    return user;
}

exports.findByRole = async (role) => {
    const data = await userModel.find({ role: role });
    return data;
}

exports.findById = async (id) => {
    const data = await userModel.findById(id);
    return data;
}

//update profile
exports.updateProfile = async (userId, userBody) => {
    return await userModel.findByIdAndUpdate( userId, userBody, { new: true} );
}

exports.delete = async (id) => {
    return await userModel.findByIdAndDelete(id);
}