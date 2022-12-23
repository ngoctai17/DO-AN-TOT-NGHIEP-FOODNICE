const productController = require('../components/products/controller');
const express = require('express');
const router = express.Router();
//middleware
const { isAuthenticatedUser } = require('../middleware/auth');

//get all products
router.get('/getAll', isAuthenticatedUser, async (req, res) => {
    const products = await productController.getAllProducts();
    let data = [];
    for(var product of products) {
        if(product.status == true){
            data.push(product);
        }
    }
    if(data){
        return res.json(data);
    }else{
        res.status(404).json({message: "No products found"});
    }
});

//get a single product
router.get('/:id', isAuthenticatedUser, async (req, res) => {
    const { id } = req.params;
    const product = await productController.getByIdProduct(id);
    if(product){
        return res.json(product);
    }else{
        res.status(404).json({message: "No products found"});
    }
});

//get a single product
router.get('/category/:id', isAuthenticatedUser, async (req, res) => {
    const { id } = req.params;
    const products = await productController.getProductByCategory(id);
    let data = [];
    for(var product of products) {
        if(product.status == true){
            data.push(product);
        }
    }
    if(data){
        return res.json(data);
    }else{
        res.status(404).json({message: "No products found"});
    }
});

//get a single product
router.get('/find/:name', isAuthenticatedUser, async (req, res) => {
    const { name } = req.params;
    const products = await productController.findByName(name);
    let data = [];
    for(var product of products) {
        if(product.status == true){
            data.push(product);
        }
    }
    if(data){
        return res.json(data);
    }else{
        res.status(404).json({message: "No products found"});
    }
});

module.exports = router;