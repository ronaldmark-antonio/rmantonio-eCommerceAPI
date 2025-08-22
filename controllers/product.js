const Product = require('../models/Product');
const { errorHandler } = require("../auth");

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
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json({
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
            return res.status(404).json({
                error: "Product not found"
            });
        }
        if (!result.isActive) {
            return res.status(200).json({
                message: "Product already archived",
                archivedProduct: result
            });
        }
        return res.status(200).json({
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
            return res.status(404).json({
                error: "Product not found"
            });
        }
        if (result.isActive) {
            return res.status(200).json({
                message: "Product already activated",
                archivedProduct: result
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product activated successfully"
        })
    }).catch(err => errorHandler(err, req, res));
}
