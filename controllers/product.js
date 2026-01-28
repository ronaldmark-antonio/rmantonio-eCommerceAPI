const Product = require('../models/Product');
const { errorHandler } = require("../auth");

module.exports.createProduct = (req, res) => {

  let normalizeName = (value) =>
    value.toLowerCase().replace(/[\s\-_]+/g, "").trim();

  let incomingNormalizedName = normalizeName(req.body.name);

  let newProduct = new Product({
    name: req.body.name.trim(),
    description: req.body.description,
    price: req.body.price
  });

  Product.find({}, { name: 1 })
    .then(products => {

      let existingProduct = products.find(product =>
        normalizeName(product.name) === incomingNormalizedName
      );

      if (existingProduct) {
        return res.status(409).send({ error: "Product already exists" });
      }

      return newProduct.save()
        .then(product => res.status(201).send(product))
        .catch(error => errorHandler(error, req, res));

    })
    .catch(error => errorHandler(error, req, res));
};


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

  const normalizeName = (value) =>
    value.toLowerCase().replace(/[\s\-_]+/g, "").trim();

  const incomingNormalizedName = normalizeName(req.body.name);
  const productId = req.params.productId;

  Product.find({}, { name: 1 })
    .then(products => {

      const duplicate = products.find(product =>
        normalizeName(product.name) === incomingNormalizedName &&
        product._id.toString() !== productId
      );

      if (duplicate) {
        return Promise.reject({
          status: 409,
          message: "Another product with this name already exists"
        });
      }

      return Product.findByIdAndUpdate(
        productId,
        {
          name: req.body.name.trim(),
          description: req.body.description,
          price: req.body.price
        },
        { new: true }
      );
    })
    .then(updatedProduct => {
      if (!updatedProduct) {
        return res.status(404).send({ error: "Product not found" });
      }

      return res.status(200).send({
        success: true,
        message: "Product updated successfully"
      });
    })
    .catch(err => {
      if (err.status === 409) {
        return res.status(409).send({ error: err.message });
      }

      // Mongo duplicate key safety
      if (err.code === 11000) {
        return res.status(409).send({
          error: "Another product with this name already exists"
        });
      }

      return errorHandler(err, req, res);
    });
};

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