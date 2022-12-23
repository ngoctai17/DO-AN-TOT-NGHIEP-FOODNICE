var express = require('express');
var router = express.Router();
const orderController = require('../components/order-detail/controller');
const cartController = require('../components/cart/controller');
const jwt = require('jsonwebtoken');
const { isLogin } = require('../middleware/auth');
const date = require('../middleware/date');

router.get('/order', [isLogin], async function (req, res, next) {
    try {
        let orders = await orderController.getAllOrder();
        let dangXuLy = [];
        let dangGiaoHang = [];
        let listOrder = [];

        for (let value of orders) {
            const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
            const formatTotals = new Intl.NumberFormat('vi-VN', config).format(value.totals);
            const formatDiscount = new Intl.NumberFormat('vi-VN', config).format(value.discount);
            if (value.delivering === 'Đã giao hàng') {
                listOrder.push({
                    date: date.format(value.date),
                    order: value,
                    totals: formatTotals,
                    discount: formatDiscount,
                })
            }else{
                if (value.delivering === 'Đang xử lý'){
                    dangXuLy.push({
                        date: date.format(value.date),
                        order: value,
                        totals: formatTotals,
                        discount: formatDiscount,
                    })
                } else {
                    dangGiaoHang.push({
                        date: date.format(value.date),
                        order: value,
                        totals: formatTotals,
                        discount: formatDiscount,
                    })
                }
            }
        }

        const { token } = req.cookies;
        var data = jwt.verify(token, 'DOANTOTNGHIEP');
        req.flash('noSearch', true);

        res.render('list-order', {
            user: data.user, dangXuLy: dangXuLy, 
            dangGiaoHang: dangGiaoHang, noSearch: req.flash('noSearch', true),
            listOrder: listOrder, success: req.flash('success')
        })
    } catch (error) {
        console.log(error);
    }
});

//pay by id
router.get('/pay/:id/:number', [isLogin], async function (req, res, next) {
    const { id, number } = req.params;
    try {
        if (number === '2') {
            const order = await orderController.getOrderById(id);
            order.delivering = 'Đang giao hàng';
            await orderController.updateStatusOrder(id, order);
            req.flash('success', true);
            res.redirect('/order');
        } else if (number === '1') {
            const order = await orderController.getOrderById(id);
            order.delivering = 'Đã giao hàng';
            order.status = true;
            await orderController.updateStatusOrder(id, order);
            req.flash('success', true);
            res.redirect('/order');
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/getOrderByMonth/:number', [isLogin], async function (req, res, next) {
    try {
        const { number } = req.params;
        let arr = []
        let orders = await orderController.getAllOrder();
        for (let value of orders) {
            let year = new Date().getFullYear();
            if (value.date.getFullYear() == year) {
                if (value.date.getMonth() === number - 1) {
                    const money = value.totals;
                    const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
                    const formated = new Intl.NumberFormat('vi-VN', config).format(money);
                    arr.push({
                        date: date.format(value.date),
                        order: value,
                        totals: formated
                    })
                }
            }
        }
        if (arr.length > 0) {
            req.flash('search', true);
        }else {
            req.flash('errorSearch', true);
        }
        const { token } = req.cookies;
        var data = jwt.verify(token, 'DOANTOTNGHIEP');
        res.render('list-order', {
            user: data.user, arr: arr,
            success: req.flash('success'), search: req.flash('search'), 
            errorSearch: req.flash('errorSearch'),
        })
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/order-detail/:id', async function (req, res, next) {
    const { id } = req.params;
    let result;
    let count = 0;
    let success = false
    let delivering = false;
    try {
        const order = await orderController.getOrderById(id);
        if (order.delivering === "Đang xử lý") {
            delivering = true;
        }
        if (order.delivering === "Đang giao hàng") {
            success = true;
        }
        const arr = [];
        for (let data of order.cart_id) {
            let cart = await cartController.getCartById(data._id);
            console.log(cart)
            arr.push(cart);
            count++;
        }

        const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
        const totals = new Intl.NumberFormat('vi-VN', config).format(order.totals);
        const discount = new Intl.NumberFormat('vi-VN', config).format(order.discount);

        result = {
            order: order,
            count: count,
            cart: arr,
            totals: totals,
            discount: discount,
            delivering: delivering,
            success: success
        }
        const { token } = req.cookies;
        var data = jwt.verify(token, 'DOANTOTNGHIEP');
        res.render('order-detail', {
            user: data.user, result: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

module.exports = router;