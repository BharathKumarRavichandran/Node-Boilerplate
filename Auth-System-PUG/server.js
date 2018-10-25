const signale        = require('signale')
const mongoose       = require('mongoose');
const express        = require('express');
const path           = require('path');
const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const config         = require('./config/config.js');
const passport       = require("passport");
const User           = require("./app/models/user");
const LocalStrategy  = require("passport-local");

//importing router
const defaultRouter = require('./app/routes/default-router.js');

//initialising express
const app = express();

//database Connection
mongoose.connect(config.mongodb.dbURI)
.then(()=>{
  signale.success('*****Database Connection Successfull******');
}).catch(err=>{
  signale.fatal(new Error(err));
  signale.warn('Could not connect to Database. Exiting now...');
  process.exit();
})
let db = mongoose.connection

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.url         = req.originalUrl;
	next();
})

//Home Route
app.get('/',(req,res)=>{
	res.render("auth/login");
})

app.use('/default', defaultRouter);

app.listen(3000,()=> {
  signale.success('Server Started on port: 3000');
})

//==============================PASSPORT CONFIG==============================
app.use(require("express-session")({
	secret: "sshoooo this is a very secrety secret",
	resave:false,
	saveUninitialized:false
}))


//================================AUTH ROUTES================================

//===SHOW REGISTER FORM=====

app.get("/register",(req,res)=>{
	res.redirect("/user/register");
})

app.get("/user/register",(req,res)=>{
	res.render("auth/register");
})

//====CHECK IF USERNAME EXISTS(WITH AJAX)======

app.get("/usernamecheck",(req,res)=>{
	User.find({username:req.query.input},(err,result)=>{
		if (err) {
			console.log(err)
		} else {
			res.send(""+result.length);
		}
	})
})

//=====REGISTER USER=======

app.post("/user/register",(req,res)=>{
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
})


//======SHOW LOGIN FORM=======

app.get("/login",(req,res)=>{
	res.redirect("/user/login");
})

app.get("/user/login",(req,res)=>{
	res.render("auth/login");
})


//======LOGIN THE USER========

app.post("/user/login",passport.authenticate("local",
	{
		successRedirect:"https://www.google.com/", // Put your success login route here
		failureRedirect:"/user/login"
	}),(req,res)=>{}
);


//========LOGOUT ROUTE==============

app.get("/user/logout",(req,res)=>{
	req.logout();
	res.redirect("/");
})

//==============MIDDLEWARE CHECK FOR LOGIN==========

function isLoggedIn(req,res,next){
	if (req.user) {
		return next();
	} else {
		res.redirect('/user/login');
	}
}
