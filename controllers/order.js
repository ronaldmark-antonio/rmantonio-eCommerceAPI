const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { errorHandler } = require("../auth");

module.exports.createOrder = async (req, res) => {
	if(req.user.isAdmin) {
		return res.status(403).json({ message: "Admin is not allowed" })
	}

    let cart = await Cart.findOne({ userId: req.user.id });
    let newOrder = new Order({
        userId: req.user.id,
        productsOrdered: cart.cartItems,
        totalPrice: cart.totalPrice
    });

    if (cart.cartItems.length === 0) {
        return res.status(404).json({ error: 'No Items to Checkout'});
    }

    return newOrder.save()
    .then(order => {
        if(cart.cartItems.length > 0){
            return res.status(201).json({ message: "Ordered Successfully"} );
        }
        else {
            return res.status(404).json({ error: 'No Items to Checkout'});
        }
    })
    .catch(error => errorHandler(error, req, res));

};

module.exports.getOrder = (req, res) => {
    return Order.find({userId: req.user.id})
    .then(order => {
        if (order.length > 0) {
			res.status(200).json({ orders: order });
        } 
    })
    .catch(error => errorHandler(error, req, res));
}

module.exports.getAllOrders = (req, res) => {
    return Order.find({})
    .then(orders => res.status(200).send(orders))
    .catch(err => errorHandler(err, req, res));
}
