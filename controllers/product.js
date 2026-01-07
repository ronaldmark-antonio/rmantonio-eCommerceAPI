const Product = require('../models/Product');
const { errorHandler } = require("../auth");

module.exports.createProduct = (req, res) => {
	let newProduct = new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});

	Product.findOne({ name: req.body.name })
	.then(existingProduct => {
		if (existingProduct) {
			return res.status(409).send({ error: 'Product already exist' })
		} else {
			return newProduct.save()
			.then(product => res.status(201).send(product))
			.catch(error => errorHandler(error, req, res));
		}
	})
	.catch(error => errorHandler(error, req, res))
}

module.exports.getAllProducts = (req, res) => {
    return Product.find({})
    .then(product => {
        if(product.length > 0){
            return res.status(200).send(product);
        }
        else {
            return res.status(404).send({ error: 'No product found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllActive = (req, res) => {
    Product.find({ isActive : true })
    .then(product => {
        if (product.length > 0){
            return res.status(200).send(product);
        }
        else {
            return res.status(404).send({
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
            return res.status(200).send(product);
        } else {
            return res.status(404).send({
                error: 'Product not found'
            });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};

module.exports.updateProduct = (req, res) => {
    return Product.findByIdAndUpdate(
        req.params.productId,
        {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        }
    ).then((result) => {
        if (!result) {
            return res.status(404).send({ error: "Product not found" });
        }
        return res.status(200).send({
            success: true,
            message: "Product updated successfully"
        });
    }).catch(err => errorHandler(err, req, res));
}

module.exports.archiveProduct = (req, res) => {
    return Product.findByIdAndUpdate(
        req.params.productId,
        { isActive: false }
    ).then(result => {
        if (!result) {
            return res.status(404).send({
                error: "Product not found"
            });
        }
        if (!result.isActive) {
            return res.status(200).send({
                message: "Product already archived",
                archivedProduct: result
            });
        }
        return res.status(200).send({
            success: true,
            message: "Product archived successfully"
        })

    }).catch(err => errorHandler(err, req, res));
}

module.exports.activateProduct = (req, res) => {
    return Product.findByIdAndUpdate(
        req.params.productId,
        { isActive: true }
    ).then(result => {
        if (!result) {
            return res.status(404).send({
                error: "Product not found"
            });
        }
        if (result.isActive) {
            return res.status(200).send({
                message: "Product already activated",
                archivedProduct: result
            });
        }
        return res.status(200).send({
            success: true,
            message: "Product activated successfully"
        })
    }).catch(err => errorHandler(err, req, res));
}

module.exports.searchProduct = (req, res) => {
    let productName = req.body.name;
    if (!productName) {
        return res.status(400).send({ message: "Product name is required" });
    }

    Product.find({ name: { $regex: productName, $options: "i" }})
    .then(product => {
        if (product.length > 0) {
            return res.status(200).send(product);
        } else {
            return res.status(404).send({ message: "No product found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
}

module.exports.searchByPrice = (req, res) => {
    let productMinPrice = req.body.minPrice;
    let productMaxPrice = req.body.maxPrice;

    if (typeof productMinPrice !== 'number'|| typeof productMaxPrice !== 'number') {
        return res.status(400).send({ message: "Invalid MinPrice or MaxPrice" });
    } 
    
    Product.find({ price: { $gte: productMinPrice, $lte: productMaxPrice } })
    .then(product => {
        if (product.length > 0) {
            return res.status(200).send(product);
        } else {
            return res.status(404).send({ message: "No products found in this price range" });
        }
    })
    .catch(error => errorHandler(error, req, res));
}