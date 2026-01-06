const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { errorHandler } = require("../auth");

module.exports.createOrder = async (req, res) => {
    Cart.findOne({ userId: req.user.id })
    .then((cart) => {
		if (!cart) {
        	return res.status(404).send({ error: 'No item(s) to checkout'});
    	} else {
    		let newOrder = new Order({
		        userId: req.user.id,
		        productsOrdered: cart.cartItems,
		        totalPrice: cart.totalPrice
	    	});

    		newOrder.save()
    		.then(order => { return res.status(201).send({ message: "Ordered successfully" }) })
    		.catch(err => errorHandler(err, req, res));
		}
    }).catch(err => errorHandler(err, req, res));
}

module.exports.getOrder = (req, res) => {
    return Order.find({userId: req.user.id})
    .then(order => {
        if (order.length > 0) {
			res.status(200).send({ orders: order });
        } 
    })
    .catch(error => errorHandler(error, req, res));
}

module.exports.getAllOrders = (req, res) => {
    return Order.find({})
    .then(orders => res.status(200).send(orders))
    .catch(err => errorHandler(err, req, res));
}
