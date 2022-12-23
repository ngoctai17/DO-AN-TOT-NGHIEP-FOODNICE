const categoryService = require('./service');

//Tạo mới một category
exports.createCategory = async (body) => {
    return await categoryService.createCategory(body);
}

//lấy tất cả thông tin category
exports.getAllCategory = async (req, res) => {
    return await categoryService.getAllCategory();
}

//get single category
exports.getCategoryById = async (id) => {
    try {
        return await categoryService.getSingleCategory(id);
    } catch (error) {
        return null;
    }
}

//update category
exports.updateCategory = async (id, body) => {
    try {
        return await categoryService.updateCategory(id, body);
    } catch (error) {
        return null;
    }
}

//delete category
exports.deleteCategory = async (body) => {
    return await categoryService.deleteCategory(body);
}