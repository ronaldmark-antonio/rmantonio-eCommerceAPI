const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const auth = require('../auth');

const { errorHandler } = auth;

module.exports.registerUser = (req, res) => {
	if (typeof req.body.firstName !== 'string' || typeof req.body.lastName !== 'string') {
        return res.status(400).json(false);
    } else if (!req.body.email.includes("@")){
        return res.status(400).json({error: 'Email invalid'});
    } else if (req.body.password.length < 8) {
        return res.status(400).json({error: 'Password must be atleast 8 characters'});
    } else if (req.body.mobileNo.length !== 11){
        return res.status(400).json({error: 'Mobile number invalid'});
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10),
            mobileNo : req.body.mobileNo
        })
        return newUser.save()
        .then((result) => res.status(201).json({
            message: 'Registered Successfully'
        }))
        .catch(error => errorHandler(error, req, res));
    }
};

// module.exports.loginUser = (req, res) => {
//     if (req.body.email.includes("@")) {
//         return User.findOne({ email : req.body.email })
//             .then(result => {
//                 if(result == null){
//                     return res.status(404).json({ error: "No Email Found"});
//                 } else {
//                     const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
//                     if (isPasswordCorrect) {
//                         return res.status(200).json({ access : auth.createAccessToken(result)});
//                     } else {
//                         return res.status(401).json({ error: "Email and password do not match"});
//                     }
//                 }
//             })
//             .catch(error => errorHandler(error, req, res));

//     } else {
//          return res.status(400).json({ error: "Invalid Email"});
//     }
// };

module.exports.loginUser = (req, res) => {
    if (!req.body.email.includes("@")) {
        return res.status(400).json({ error: "Invalid Email" });
    }

    return User.findOne({ email: req.body.email })
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: "No Email Found" });
            }
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
            if (isPasswordCorrect) {
                return res.status(200).json({ access: auth.createAccessToken(result) });
            } else {
                return res.status(401).json({ error: "Email and password do not match" });
            }
        })
        .catch(error => errorHandler(error, req, res));
}

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
    const newPassword = req.body.newPassword;
    const newHashedPassword = bcrypt.hashSync(newPassword, 10);

    return User.findByIdAndUpdate(req.user.id, { password: newHashedPassword })
    .then(newPassword => {res.status(201).json({ message: "Password reset successfully." })
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
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            updatedUser: updatedUser
        });
    }).catch(err => errorHandler(err, req, res));
}
