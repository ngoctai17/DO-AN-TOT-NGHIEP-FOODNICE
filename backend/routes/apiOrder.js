var express = require('express');
var router = express.Router();
const orderController = require('../components/order-detail/controller');
const cartController = require('../components/cart/controller');
const productController = require('../components/products/controller');
const discountController = require('../components/discount/controller');
//middleware
const { isAuthenticatedUser } = require('../middleware/auth');
const socketAPI = require('../socketIO/socket_api');
const date = require('../middleware/date');

router.post('/checkout', isAuthenticatedUser, async function (req, res, next) {
    let { body } = req;
    try {
        let error = false;
        let message = '';
        let discount = null;
        let arr = [];
        let order;
        let provisional = 0;
        let totals = 0;
        let percent = 0;

        const cart = await cartController.getCartByUser(body.user_id);

        for (let value of cart) {
            let cart = await cartController.getCartById(value._id);
            let product = await productController.getByIdProduct(cart.product_id._id);

            if (product.quantity < cart.quantity) {
                error = true;
                message = 'Sản phẩm ' + product.name + " không còn đủ số lượng!"
                break;
            } else {
                if (body.discount) {
                    const discountGet = await discountController.getByDiscount(body.discount);
                    discount = discountGet;
                    console.log(discount)
                    if (!discount) {
                        error = true;
                        message = "Mã giảm giá không tồn tại!"
                        break;
                    }
                    else {
                        if (discount.quantity == 0) {
                            error = true;
                            message = 'Mã giảm giá đã hết lượt dùng!'
                            break;
                        } else {
                            if (discount.all === true) {
                                percent = discount.percent;
                            } else {
                                if (discount.product_id) {
                                    if (String(discount.product_id._id) === String(product._id)) {
                                        percent = discount.percent;
                                    } else {
                                        error = true;
                                        message = 'Mã giảm giá không áp dụng cho sản phẩm này!'
                                        break;
                                    }
                                } else {
                                    const productDiscount = await productController.getAllProductsTrueByCategory(discount.category_id);
                                    for (const value of productDiscount) {
                                        if (String(value._id) == String(product._id)) {
                                            percent = percent + discount.percent;
                                            break;
                                        }
                                    }
                                    if (percent == 0) {
                                        error = true;
                                        message = 'Mã giảm giá không áp dụng cho sản phẩm này!'
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (error === false) {
                    //update quantity product
                    product.quantity = product.quantity - cart.quantity;
                    product.quantity_purchased = product.quantity_purchased + cart.quantity;
                    await productController.updateProduct(product._id, product);
                    //update status cart
                    cart.status = true;
                    await cartController.updateCart(cart._id, cart);
                }
            }

            if (error === false) {
                provisional = totals + (value.quantity * value.product_id.price)
                totals = totals + (value.quantity * value.product_id.price * ((100 - percent) / 100))
                arr.push(value._id)
            }
        }

        if (error === false) {
            order = {
                cart_id: arr,
                user_id: body.user_id,
                customer: body.customer,
                phone: body.phone,
                address: body.address,
                totals: totals,
                discount: provisional - totals,
                status: body.status,
            };

            if (percent > 0) {
                discount.quantity = discount.quantity - 1;
                await discountController.updateDiscount(discount._id, discount)
            }
            const order_id = await orderController.createOrder(order);
            socketAPI.sendNotify(order_id._id);
            res.status(200).json(order);
        }

        if (error) {
            res.status(200).json({ message: message })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message : error.data });
    }
});

router.get('/get/:id', async function (req, res, next) {
    let { id } = req.params;
    try {
        let data = [];
        const orders = await orderController.getOrderByUser(id);
        for (let order of orders) {
            let cart_data = [];
            let count = 0;
            for (let cart of order.cart_id) {
                const cartGet = await cartController.getCartById(cart);
                cart_data.push(cartGet)
            }
            for (let countGet of cart_data) {
                count++;
            }
            data.push({
                _id: order._id,
                user_id: order.user_id,
                customer: order.customer,
                address: order.address,
                phone: order.phone,
                totals: order.totals,
                date: date.format(order.date),
                status: order.status,
                delivering: order.delivering,
                discount: order.discount,
                count: count,
                cart: cart_data,
            })
        }
        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

module.exports = router;