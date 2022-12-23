const favoriteController = require('../components/favorite/controller');
const express = require('express');
const router = express.Router();
//middleware
const { isAuthenticatedUser } = require('../middleware/auth');

router.post('/add', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { body } = req;
        const favorite = await favoriteController.createFavorite(body);
        return res.status(200).json(favorite);
    } catch {
        return res.status(400).json({ message: "No favorite" });
    }
});

router.post('/delete', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { body } = req;
        const favorite = await favoriteController.deleteFavoriteByUserIdAndProductId(body.user_id, body.product_id);
        return res.status(200).json(favorite);
    } catch {
        return res.status(400).json({ message: "Co loi xay ra" });
    }
});

router.get('/get/:id', isAuthenticatedUser, async function (req, res, next) {
    try {
        const { id } = req.params;
        const favorites = await favoriteController.getByUser(id);
        let data = [];
        for (let favorite of favorites) {
            data.push({
                _id: favorite.product_id._id,
                name: favorite.product_id.name,
                price: favorite.product_id.price,
                image: favorite.product_id.image,
                description: favorite.product_id.description
            });
        }
        return res.status(200).json(data);
    } catch (e) {
        console.log(e)
        return res.status(400).json({ message: "No favorite" });
    }
});

module.exports = router;