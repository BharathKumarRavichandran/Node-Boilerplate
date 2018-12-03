const signale  = require('signale')
const path     = require('path');
const passport = require('passport');
const sanitize = require('mongo-sanitize');
const config   = require('../../config/config.js');

// Importing models
const User = require('../models/user-model.js');


exports.renderRegisterForm = (req, res) => {
    return res.render('auth/register');
}

exports.renderLoginForm = (req, res) => {
    return res.render('auth/login');
}

//====CHECK IF USERNAME EXISTS(WITH AJAX)======
exports.usernameCheck = (req,res)=>{
	User.find({username:req.query.input},(err,result)=>{
		if (err) {
			console.log(err)
		} else {
			res.send(""+result.length);
		}
	})
}

exports.registerUser = (req,res) =>{
    formData = {
        username:req.body.username,
        shop_name:req.body.company_name,
        mobile_number:req.body.mobile_number,
        email:req.body.email
    };
    User.register(new User(formData),req.body.password,(err,newUser)=>{
        if (err) {
            console.log(err)
            return res.redirect("/register")
        } else {
            newUser.save()
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/");
            })			
        }
    })
}

exports.validateLogin = (req, res, next) => { 
    passport.authenticate("local",
        {
            successRedirect:"https://www.google.com/", // Put your success login route here
            failureRedirect:"/user/login"
        })(req, res, next)
};

exports.logoutUser = (req,res)=>{
    req.logout();
    res.redirect("/");
}