const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { errorHandler } = require("../auth");

module.exports.getUserDetails = (req, res) => {
    return User.findById(req.user.id).select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({error: "User not found."});
            }

            return res.status(200).json({
                user: user
            });
        })
        .catch(error => errorHandler(error, req, res));
}

module.exports.updatePassword= (req, res) => {
    const newPassword = req.user.newPassword;
    const newHashedPassword = bcrypt.hashSync(newPassword, 10);

    User.findByIdAndUpdate(
        req.user.id,
        { password: newHashedPassword }
    );

    return res.status(201).json({ message: "Password reset successfully." });
}

module.exports.setAsAdmin = (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId,
        { isAdmin: true },
        { new: true, runValidators: true }
    ).then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            updatedUser: updatedUser
        });
    }).catch(err => errorHandler(err, req, res));
}
