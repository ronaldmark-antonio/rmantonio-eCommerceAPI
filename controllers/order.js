const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { errorHandler } = require("../auth")

module.exports.createOrder = (req, res) => {
    Cart.findOne({ userId: req.user.id })
        .then((cart) => {
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            if (cart.cartItems.length == 0) {
                return res.status(404).json({ error: "No Items to Checkout" })
            }

            new Order({
                userId: req.user.id,
                totalPrice: cart.totalPrice,
                productsOrdered: cart.cartItems
            }).save()
                .then(order => { return res.status(201).json({ message: "Ordered Successfully" }) })
                .catch(err => errorHandler(err, req, res));
        }).catch(err => errorHandler(err, req, res));
}
