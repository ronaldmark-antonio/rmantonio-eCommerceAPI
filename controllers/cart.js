const Cart = require("../models/Cart");
const { errorHandler } = require("../auth")

module.exports.getCart = (req, res) => {
	return Cart.findOne({ userId: req.user.id })
	.then(cart => {
	if (cart) {
			return res.status(200).send({ cart: cart });
		}
		return res.status(404).send({ message: "No cart found" });
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.addToCart = (req, res) => {
    if (typeof req.body.quantity != "number" || req.body.quantity < 1) {
        return res.status(400).send({ message: "Invalid quantity value" })
    }
    if (typeof req.body.subtotal != "number" || req.body.subtotal < 1) {
        return res.status(400).send({ message: "Invalid subtotal value" })
    }

    Cart.findOne({ userId: req.user.id })
    .then((cart) => {
        let userCart = {};
        if (!cart) {
            userCart = new Cart({
                userId: req.user.id,
                cartItems: [],
                totalPrice: 0
            });
        } else {
            userCart = cart
        }

        let existingProduct = userCart.cartItems.find(product => product.productId == req.body.productId);
        if (existingProduct) {
            existingProduct.quantity += req.body.quantity;
            existingProduct.subtotal += req.body.subtotal;
        } else {
            userCart.cartItems.push({
                productId: req.body.productId,
                quantity: req.body.quantity,
                subtotal: req.body.subtotal
            })
        }
        userCart.totalPrice += req.body.subtotal
        return userCart.save()
            .then((result) => res.status(201).send({
                message: "Item added to cart successfully",
                cart: result
            })).catch(error => errorHandler(error, req, res));
    }).catch(err => errorHandler(err, req, res));
}

module.exports.updateCartQuantity = (req, res) => {
    if (typeof req.body.newQuantity != "number" || req.body.newQuantity < 1) {
        return res.status(400).send({ message: "Invalid quantity value" })
    }

    Cart.findOne({ userId: req.user.id })
    .then((cart) => {
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        productToEdit = cart.cartItems.find(product => product.productId === req.body.productId)
        if (productToEdit) {
            oldSubtotal = productToEdit.subtotal
            productToEdit.subtotal *= req.body.newQuantity / productToEdit.quantity
            productToEdit.quantity = req.body.newQuantity
            cart.totalPrice += productToEdit.subtotal - oldSubtotal

            return cart.save()
                .then(result => res.status(200).send({
                    message: "Item quantity updated successfully",
                    updatedCart: result
                })).catch(err => errorHandler(err, req, res));
        } else {
            return res.status(404).send({ message: "Item not found in cart" })
        }
    }).catch(err => errorHandler(err, req, res))
}

module.exports.removeFromCart = (req, res) => {
    Cart.findOne({ userId: req.user.id })
    .then((cart) => {
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const productId = req.params.productId;
        if (cart.cartItems.some(product => product.productId.toString() === productId.toString())) {
            cart.cartItems = cart.cartItems.filter(product => product.productId.toString() !== productId.toString())
            cart.totalPrice = cart.cartItems.reduce((accumulated, current) => accumulated + accumulated.subtotal, 0)

            return cart.save()
                .then(result => res.status(200).send({
                    message: "Item removed from cart successfully",
                    updatedCart: result
                })).catch(err => errorHandler(err, req, res));
        } else {
            return res.status(404).send({ message: "Item not found in cart" })
        }
    }).catch(err => errorHandler(err, req, res))
}

module.exports.clearCart = (req, res) => {
    Cart.findOne({ userId: req.user.id })
    .then((cart) => {
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        if (cart.cartItems.length > 0) {
            cart.cartItems = []
            cart.totalPrice = 0

            return cart.save()
                .then(result => res.status(200).send({
                    message: "Cart cleared successfully",
                    updatedCart: result
                })).catch(err => errorHandler(err, req, res));
        } else {
            return res.status(200).send({ message: "Cart already empty" })
        }
    }).catch(err => errorHandler(err, req, res))
}
