const addressController = require('../components/address/controller');
const express = require('express');
const router = express.Router();
//middleware
const { isAuthenticatedUser } = require('../middleware/auth');

router.post('/add', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { body } = req;
        const add = await addressController.create(body);
        return res.status(200).json(add);
    } catch {
        return res.status(400).json({ message: "No address" });
    }
});

router.post('/update', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { body } = req;
        console.log(body)
        const add = await addressController.update(body._id, body);
        return res.status(200).json(add);
    } catch {
        return res.status(400).json({ message: "No address" });
    }
});

router.get('/getByUser/:id', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { id } = req.params;
        const add = await addressController.getByUser(id);
        return res.status(200).json(add);
    } catch {
        return res.status(400).json({ message: "No address" });
    }
});

router.get('/delete/:id', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { id } = req.params;
        const add = await addressController.delete(id);
        return res.status(200).json(add);
    } catch {
        return res.status(400).json({ message: "No address" });
    }
});


module.exports = router;