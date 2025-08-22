const Product = require("../models/Product");
const { errorHandler } = require('../auth');

module.exports.createProduct = (req, res) => {
	let newProduct = new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});

	Product.findOne({ name: req.body.name })
	.then(existingProduct => {
		if (existingProduct) {
			return res.status(409).json({ error: 'Product already exists' })
		} else {
			return newProduct.save()
			.then(product => res.status(201).json(product))
			.catch(error => errorHandler(error, req, res));
		}
	})
	.catch(error => errorHandler(error, req, res))
}

module.exports.getAllProducts = (req, res) => {
    return Product.find({})
    .then(product => {
        if(product.length > 0){
            return res.status(200).json(product);
        }
        else {
            return res.status(404).json({ error: 'No product found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllActive = (req, res) => {
    Product.find({ isActive : true })
    .then(product => {
        if (product.length > 0){
            return res.status(200).json(product);
        }
        else {
            return res.status(404).json({
                error: "No active product found"
            })
        }
    })
    .catch(err => res.status(500).send(err));

};

module.exports.getProduct = (req, res) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(product) {
            return res.status(200).json(product);
        } else {
            return res.status(404).json({
                error: 'Product not found'
            });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};