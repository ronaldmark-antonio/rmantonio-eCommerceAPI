const Cart = require("../models/Cart");
const { errorHandler } = require("../auth")

module.exports.getCart = (req, res) => {
	return Cart.findOne({ userId: req.user.id })
	.then(cart => {
	if (cart) {
			return res.status(200).json({ cart: cart });
		}
		return res.status(404).json({ message: "No cart found" });
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.addToCart = (req, res) => {
    if (typeof req.body.quantity != "number" || req.body.quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity value" })
    }
    if (typeof req.body.subtotal != "number" || req.body.subtotal < 1) {
        return res.status(400).json({ error: "Invalid subtotal value" })
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
            .then((result) => res.status(201).json({
                message: "Item added to cart successfully",
                cart: result
            })).catch(error => errorHandler(error, req, res));
    }).catch(err => errorHandler(err, req, res));
}

module.exports.updateCartQuantity = (req, res) => {
    if (typeof req.body.newQuantity != "number" || req.body.newQuantity < 1) {
        return res.status(400).json({ error: "Invalid quantity value" })
    }

    Cart.findOne({ userId: req.user.id })
    .then((cart) => {
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        productToEdit = cart.cartItems.find(product => product.productId === req.body.productId)
        if (productToEdit) {
            oldSubtotal = productToEdit.subtotal
            productToEdit.subtotal *= req.body.newQuantity / productToEdit.quantity
            productToEdit.quantity = req.body.newQuantity
            cart.totalPrice += productToEdit.subtotal - oldSubtotal

            return cart.save()
                .then(result => res.status(200).json({
                    message: "Item quantity updated successfully",
                    updatedCart: result
                }));
        } else {
            return res.status(404).json({ error: "Item not found in cart" })
        }
    })
}
