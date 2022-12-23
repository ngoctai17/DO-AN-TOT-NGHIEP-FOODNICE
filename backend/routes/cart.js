var express = require('express');
var router = express.Router();
const productController = require('../components/products/controller');
const discountController = require('../components/discount/controller');
const categoryController = require('../components/category/controller');
const cartController = require('../components/cart/controller');
const orderController = require('../components/order-detail/controller');
const jwt = require('jsonwebtoken');
const { isLogin } = require('../middleware/auth');
const socketAPI = require('../socketIO/socket_api'); //test socket

router.get('/add-cart', [isLogin], async function (req, res, next) {
    const products = await productController.getAllProductsTrue();
    let productsList = [];
    for (let product of products) {
        const money = product.price;
        const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
        const formated = new Intl.NumberFormat('vi-VN', config).format(money);
        productsList.push({
            product: product,
            productPrice: formated
        })
    }
    const categories = await categoryController.getAllCategory();
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('add-cart-list', {
        products: productsList, user: data.user,
        success: req.flash('success'), categories: categories
    });
});

router.get('/add-cart/:idCategory', [isLogin], async function (req, res, next) {
    const { idCategory } = req.params;
    const products = await productController.getAllProductsTrueByCategory(idCategory);
    let productsList = [];
    for (let product of products) {
        const money = product.price;
        const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
        const formated = new Intl.NumberFormat('vi-VN', config).format(money);
        productsList.push({
            product: product,
            productPrice: formated
        })
    }
    const categories = await categoryController.getAllCategory();
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    res.render('add-cart-list', {
        products: productsList, user: data.user,
        success: req.flash('success'), categories: categories
    });
});

router.post('/cart/add/:id', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    const { quantity } = req.body;
    console.log(quantity);
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    const dataCart = [];
    try {
        if (quantity) {
            dataCart.push({
                quantity: quantity,
                status: false,
                product_id: id,
                user_id: data.user._id,
            });
            const check = await cartController.getCartByUserIdAndProductId(data.user._id, id);
            if (check) {
                if (quantity == 0) {
                    res.redirect('/add-cart');
                }
                const q = Number(quantity);
                check.quantity = q;
                await cartController.updateCart(check._id, check);
                req.flash('success', true);
                res.redirect('/add-cart');
            } else {
                if (quantity == 0) {
                    res.redirect('/add-cart');
                }
                await cartController.createCart(dataCart);
                req.flash('success', true);
                res.redirect('/add-cart');
            }
        } else {
            res.redirect('/add-cart');
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/list-cart', [isLogin], async function (req, res, next) {
    const { token } = req.cookies;
    var data = jwt.verify(token, 'DOANTOTNGHIEP');
    const cart = await cartController.getCartByUser(data.user._id);
    if (cart.length > 0) {
        let arr = [];
        let count = 0;
        let tamtinh = 0;
        for (let value of cart) {
            count = count + 1;
            const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
            const formated = new Intl.NumberFormat('vi-VN', config).format(value.product_id.price);
            tamtinh = tamtinh + (value.quantity * value.product_id.price)
            arr.push({
                cart: value,
                price: formated
            })
        }
        const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
        const tongtien = new Intl.NumberFormat('vi-VN', config).format(tamtinh);
        res.render('list-cart', {
            user: data.user, cart: arr, count: count,
            error: req.flash('error'), tongtien: tongtien
        });
    } else {
        req.flash('noCart', true);
        res.render('list-cart', {
            user: data.user,
            noCart: req.flash('noCart')
        });
    }
});

router.post('/checkout', [isLogin], async function (req, res, next) {
    try {
        let error = false;
        const { token } = req.cookies;
        var data = jwt.verify(token, 'DOANTOTNGHIEP');
        const cart = await cartController.getCartByUser(data.user._id);
        let discount = null;
        let arr = [];
        let order;
        let provisional = 0;
        let totals = 0;
        let percent = 0;

        const { customer, phone, discountName } = req.body;

        if (Object.entries(customer).length == 0 || Object.entries(phone).length == 0) {
            req.flash('error', "Vui lòng nhập thông tin");
            res.redirect('list-cart');
        } else {
            for (let value of cart) {
                let cart = await cartController.getCartById(value._id);
                let product = await productController.getByIdProduct(cart.product_id._id);

                if (product.quantity < cart.quantity) {
                    error = true;
                    req.flash('error', "Sản phẩm: " + product.name + " không đủ!");
                    res.redirect('list-cart');
                    break;
                } else {
                    if (Object.entries(discountName).length > 0) {
                        const discount = await discountController.getByDiscount(discountName);
                        discount = discount;
                        if (!discount) {
                            error = true;
                            req.flash('error', 'Mã giảm giá không tồn tại!');
                            res.redirect('list-cart');
                            break;
                        } else {
                            if (discount.quantity == 0) {
                                error = true;
                                req.flash('error', 'Mã giảm giá đã hết lượt dùng!');
                                res.redirect('list-cart');
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
                                            req.flash('error', "Mã giảm giá không áp dụng cho sản phẩm này");
                                            res.redirect('list-cart');
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
                                            req.flash('error', "Mã giảm giá không áp dụng cho sản phẩm này");
                                            res.redirect('list-cart');
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
                    user_id: data.user._id,
                    customer: customer,
                    phone: phone,
                    address: 'Tại cửa hàng',
                    totals: totals,
                    discount: provisional - totals,
                    status: true,
                };

                if (percent > 0) {
                    discount.quantity = discount.quantity - 1;
                    await discountController.updateDiscount(discount._id, discount)
                }

                req.flash('success', true);
                const order_id = await orderController.createOrder(order);
                socketAPI.sendNotify(order_id._id);  //test socket
                res.redirect('add-cart');
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});

//delete
router.get('/delete-cart/:id', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    await cartController.deleteCart(id);
    res.redirect('/list-cart');
});

router.get('/cart/plus/:id', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    try {
        let cart = await cartController.getCartById(id);
        cart.quantity++;
        await cartController.updateCart(id, cart);
        res.redirect('/list-cart');
    } catch (error) {
        console.log(error);
    }
});

router.get('/cart/minus/:id', [isLogin], async function (req, res, next) {
    const { id } = req.params;
    try {
        let cart = await cartController.getCartById(id);
        cart.quantity = cart.quantity - 1;
        if (cart.quantity == 0) {
            await cartController.deleteCart(id);
        } else {
            await cartController.updateCart(id, cart);
        }
        res.redirect('/list-cart');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;