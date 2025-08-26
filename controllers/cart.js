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