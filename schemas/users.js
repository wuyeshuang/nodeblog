var mongoose = require('mongoose')

module.exports = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	isAdmin:{
		type: Boolean,
		default: false
	},
	user_photo: {
	  type: String,
	  default: '/public/images/avatar-default.png'
	},
	realname: {
		type: String,
		default: ""
	},
	gender: {
		type: String,
		default: ""
	},
	age: {
		type: String,
		default: ""
	},
	industry: {
		type: String,
		default: ""
	},
	introduce: {
		type: String,
		default: ""
	},
})