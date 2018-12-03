const mongoose              = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
	username:String,
	password:String,
	company_name:String,
	mobile_number:String,
	email:String
})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("user",userSchema);