var express = require('express');
var router = express.Router();
const orderController = require('../components/order-detail/controller');
const productController = require('../components/products/controller');
const jwt = require('jsonwebtoken');
const { isLogin } = require('../middleware/auth');

//get all
router.get('/home', [isLogin], async function (req, res, next) {
    //get top 
    const top5Product = await productController.getTop5Product();
    let topFive = []
    //get total in year
    let revenue = 0;
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let total1 = 0, total2 = 0, total3 = 0, total4 = 0, total5 = 0, total6 = 0,
        total7 = 0, total8 = 0, total9 = 0, total10 = 0, total11 = 0, total12 = 0;
    const order = await orderController.getAllOrder();
    let statistical = []
    for (const value of order) {
        if(value.status){
            if (value.date.getFullYear() == year) {
                if (value.date.getMonth() == month) {
                    revenue = revenue + value.totals;
                }
                if (value.date.getMonth()+1 >= 1 && value.date.getMonth()+1 < 2) {
                    total1 = total1 + value.totals;
                } else
                if (value.date.getMonth()+1 < 3) {
                    total2 = total2 + value.totals;
                } else
                if (value.date.getMonth()+1 < 4) {
                    total3 = total3 + value.totals;
                } else
                if (value.date.getMonth()+1 < 5) {
                    total4 = total4 + value.totals;
                } else
                if (value.date.getMonth()+1 < 6) {
                    total5 = total5 + value.totals;
                } else
                if (value.date.getMonth()+1 < 7) {
                    total6 = total6 + value.totals;
                } else
                if (value.date.getMonth()+1 < 8) {
                    total7 = total7 + value.totals;
                } else
                if (value.date.getMonth()+1 < 9) {
                    total8 = total8 + value.totals;
                } else
                if (value.date.getMonth()+1 < 10) {
                    total9 = total9 + value.totals;
                } else
                if (value.date.getMonth()+1 < 11) {
                    total10 = total10 + value.totals;
                } else 
                if (value.date.getMonth()+1 < 12){
                    total11 = total11 + value.totals;
                }else {
                    total12 = total12 + value.totals;
                }
            }
        }
    }
    //set total value
    statistical.push(
        total1,total2,total3,total4,total5,total6,
        total7,total8,total9,total10,total11,total12
    )
    //set top 5 value
    topFive.push(
        top1 = top5Product[0],
        top2 = top5Product[1],
        top3 = top5Product[2],
        top4 = top5Product[3],
        top5 = top5Product[4],
    );

    const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
    revenue = new Intl.NumberFormat('vi-VN', config).format(revenue);
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('home', {user: data.user, statistical: statistical, revenue: revenue, topProduct: top5Product[0], topFive: topFive});

});

module.exports = router;