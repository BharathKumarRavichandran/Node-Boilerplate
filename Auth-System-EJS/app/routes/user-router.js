const path           = require('path')
const router         = require('express').Router()
const signale        = require('signale');

// Importing models
const User           = require("../models/user-model")

//importing controllers
const userController = require('../controllers/user-controller.js');

//==============MIDDLEWARE CHECKs==========
//sessionChecker middlewares
let sessionChecker = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/user/login')
  } else {
    next()
  }
}

// check for url tampering
let validateURL = (req, res, next) => {
  if (req.params.username != req.session.user.username) {
    req.session.destroy(err => {
      if (err) {
        signale.debug('error')
        return next(err)
      }
      return res.redirect('/user/login')
    })
  }
  next()
}

//check if already logged in.
function isLoggedIn(req,res,next){
	/*if (req.user) {
		return next();
	} else {
		res.redirect('/user/login');
    }*/
    return next()
}

// register
router.get('/register', userController.renderRegisterForm)
router.post('/register', userController.registerUser)

// login
router.get('/login', isLoggedIn, userController.renderLoginForm)
router.post('/login', userController.validateLogin)

//====CHECK IF USERNAME EXISTS(WITH AJAX)======
router.get("/usernamecheck", isLoggedIn, userController.usernameCheck)


//========LOGOUT ROUTE==============
router.get("/logout", userController.logoutUser)



module.exports = router
