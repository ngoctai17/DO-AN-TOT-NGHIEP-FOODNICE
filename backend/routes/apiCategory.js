const categoryController = require('../components/category/controller');
const express = require('express');
const router = express.Router();
//middleware
const { isAuthenticatedUser } = require('../middleware/auth');

router.get('/getAll', isAuthenticatedUser, async function (req, res, next) {
    const categories = await categoryController.getAllCategory();
    if (categories) {
        return res.json(categories);
    } else {
        res.status(404).json({ message: "No category found" });
    }
});

module.exports = router;