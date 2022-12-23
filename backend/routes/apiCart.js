var express = require('express');
var router = express.Router();
const cartController = require('../components/cart/controller');
//middleware
const { isAuthenticatedUser } = require('../middleware/auth');

router.post('/add', [isAuthenticatedUser], async function (req, res, next) {
    let { body } = req;
    try {
        body.status = false;
        const check = await cartController.getCartByUserIdAndProductId(body.user_id, body.product_id);
        if (check) {
            res.status(200).json('Món này đã có trong giỏ hàng!')
        } else {
            const cart = await cartController.createCart(body);
            res.status(200).json(cart);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/update-cart', [isAuthenticatedUser], async function (req, res, next) {
    let { body } = req;
    try {
        body.status = false;
        if (body.quantity == 0) {
            const cart = await cartController.deleteCart(body._id);
            res.status(200).json(cart)
        } else {
            const cart = await cartController.updateCart(body._id, body);
            res.status(200).json(cart)
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/delete/:id', [isAuthenticatedUser], async function (req, res, next) {
    let { id } = req.params;
    try {
        await cartController.deleteCart(id);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get cart by user id
router.get('/get/:user_id', [isAuthenticatedUser], async function (req, res, next) {
    let { user_id } = req.params;
    try {
        const carts = await cartController.getCartByUser(user_id);
        console.log('userid: ' + user_id)
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;