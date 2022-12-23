const categoryModel = require('./model');

//Tạo mới một category
exports.createCategory = async (categoryBody) => {
    await categoryModel.create(categoryBody);
}

//lấy tất cả thông tin category
exports.getAllCategory = async () => {
    return await categoryModel.find();
}

//get single category
exports.getSingleCategory = async (id) => {
    return await categoryModel.findById(id);
}

//update category
exports.updateCategory = async (id, categoryBody) => {
    return await categoryModel.findByIdAndUpdate(id, categoryBody, { new: true })
}

//delete category
exports.deleteCategory = async (id) => {
    return await categoryModel.findByIdAndDelete(id);
}