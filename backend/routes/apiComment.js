const commentController = require('../components/comment/controller');
const express = require('express');
const router = express.Router();
//middleware
const { isAuthenticatedUser } = require('../middleware/auth');

router.post('/add', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { body } = req;
        const comment = await commentController.createComment(body);
        return res.status(200).json(comment);
    } catch {
        return res.status(400).json({ message: "No comment" });
    }
});

router.get('/get/:id', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { id } = req.params;
        const comments = await commentController.getByProductId(id);
        return res.status(200).json(comments);
    } catch {
        return res.status(400).json({ message: "No comment" });
    }
});

module.exports = router;