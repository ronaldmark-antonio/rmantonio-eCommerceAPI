const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = "ECommerceAPI"

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, JWT_SECRET_KEY, {});
}

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(401).json({
            detail: "Authentication credentials were not provided."
        });
    } else {
        token = token.slice(7, token.length);
        jwt.verify(token, JWT_SECRET_KEY, function (err, decodedToken) {
            if (err) {
                // Zuitt API return status 200... lol?
                return res.status(403).json({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                req.user = decodedToken;
                next();
            }
        });
    }
}

module.exports.verifyAdmin = (req, res, next) => {
    if(req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }
}

module.exports.errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            error: errorMessage,
            details: err.details
        }
    });
};
