const express = require('express');
const { UserControl } = require('../controllers/userController');
const router = express.Router();
const bcrypt = require("bcrypt");

const User  = require("../models/User");

router.post('/signup', (req, res) => {
    let{name, email, password, dateOfBirth} = req.body;
    console.log(name, email, password, dateOfBirth)
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if(name == "" || email == "" || password == "" || dateOfBirth == "" ) {
        res.json({
            status: "FAILED",
            message: "Empty Input Field!"
        });
    }
    else if (!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status: "Failed",
            message: "Invalid Name Valid"
        });
    }
    // else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2, 3})+$/.test(email)) {
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {    
        res.json({
            status: "Failed",
            message: "Invalid Email Entered"

        })
    }
    else if (!new Date(dateOfBirth).getTime()) {
        res.json({
            status: "Failed",
            message: "Invalid date of Birth"
        })
    }
    else if (password.length < 8) {
        res.json({
            status: "Failed",
            message: "Password is too short"
        })
    }
    else {
        User.find({email}).then(result => {
            if (result.length) {
                res.json({
                    status: "Failed",
                    message: "User with provided email already exists"
                })
            }
            else{

                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "Success",
                            message: "SignUp Succeddfully",
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "Failed",
                            message: "An Error occurred while Saving Password!"
                        })
                    })

                })
                .catch(err => {
                    res.body({
                        status: "Failed",
                        message: "An error Occured While hashing password for User"
                    })
                })

            }

        }).catch(err => {
            console.log(err);
            res.json({
                status: "Failed",
                message: "An error Occured While Checking for existing User"
            })
        })

    }

})
// router.route("/signup").post(UserControl)

router.post('/signin', (req, res) => {
    let{ email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if(email == "" || password == "") {
        res.json({
            status: "Failed",
            message: "Empty credentials Supplied"
        })
    }
    else {
        User.find({email})
        .then(data => {
            if (data.length) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result) {
                        res.json({
                            status: "Success",
                            message: "Signin Successful",
                            data: data
                        })
                    }
                    else {
                        res.json({
                            status: "Failed",
                            message: "Invalid username and Password Entered"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "Failed",
                        message: "An error occurred while Comparing password"
                    })
                })
            }
            else {
                res.json({
                    status: "Failed",
                    message: "Invalid Credentials Entered!"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "Failed",
                message: "An error occurred while checking for existing user"
            })
        })
    }

})

module.exports = router;