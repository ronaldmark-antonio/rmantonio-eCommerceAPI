const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const auth = require('../auth');

const { errorHandler } = auth;

module.exports.registerUser = (req, res) => {
	if (typeof req.body.firstName !== 'string' || typeof req.body.lastName !== 'string') {
        return res.status(400).send(false);
    } else if (!req.body.email.includes("@")){
        return res.status(400).send({error: 'Email invalid'});
    } else if (req.body.password.length < 8) {
        return res.status(400).send({error: 'Password must be atleast 8 characters'});
    } else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({error: 'Mobile number invalid'});
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10),
            mobileNo : req.body.mobileNo
        })
        return newUser.save()
        .then((result) => res.status(201).send({
            message: 'Registered Successfully'
        }))
        .catch(error => errorHandler(error, req, res));
    }
};

module.exports.loginUser = (req, res) => {
    if (req.body.email.includes("@")) {
        return User.findOne({ email : req.body.email })
    .then(result => {
        if(result == null){
            return res.status(404).send({ error: "No Email Found"});
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
            if (isPasswordCorrect) {
                return res.status(200).send({ access : auth.createAccessToken(result)});
            } else {
                return res.status(401).send({ error: "Email and password do not match"});
            }
        }
    })
    .catch(error => errorHandler(error, req, res));

    } else {
         return res.status(400).send({ error: "Invalid Email"});
    }
};

module.exports.getUserDetails = (req, res) => {
    return User.findById(req.user.id).select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).send({error: "User not found."});
            }

            return res.status(200).send({
                user: user
            });
        })
        .catch(error => errorHandler(error, req, res));
}

module.exports.updatePassword= (req, res) => {
    const newPassword = req.body.newPassword;
    const newHashedPassword = bcrypt.hashSync(newPassword, 10);

    return User.findByIdAndUpdate(req.user.id, { password: newHashedPassword })
    .then(newPassword => {res.status(201).send({ message: "Password reset successfully." })
    })
    .catch(error => errorHandler(error, req, res));  
}

module.exports.setAsAdmin = (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId,
        { isAdmin: true },
        { new: true, runValidators: true }
    ).then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).send({ error: "User not found" });
        }

        return res.status(200).send({
            updatedUser: updatedUser
        });
    }).catch(err => errorHandler(err, req, res));
}
