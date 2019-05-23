// var express = require('express')
// var User = require('../models/User')
// var Category = require('../models/Category')
// var Content = require('../models/Content')
// var Comment = require('../models/Comment')
// var fs = require('fs')
// var path = require('path')
// var formidable = require('formidable')
// var router = express.Router()
// 
// 
// // 中间键处理导航分类的通用数据
// var categories = {}
// router.use(function(req, res, next) {
// 	
// 	
// // let domain = req.headers['referer'].match(/^(\w+:\/\/)?([^\/]+)/i);
// // domain = domain ? domain[2].split(':')[0].split('.').slice(-2).join('.') : null;
// // conso.log(domain)
// 	// console.log(req.headers.origin)
// 	var aaa=req.headers.origin
// 	
// 	res.header("Access-Control-Allow-Origin", aaa);
// 	res.header("Access-Control-Allow-Credentials", "true");
// 	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
// 	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
// 	
// 	// 	cors({
// 	//   origin: ['http://127.0.0.1:3006', 'http://127.0.0.1:5500'],
// 	//   credentials: true
// 	// })
// 		
// 
// 	Category.find().then((categorie)=> {
// 		categories = categorie;
// 		next();
// 	});
// });
// 
// 
// router.get("/personal", (req, res) => {
// 	User.findOne({_id:req.userInfo}).then(personalInfo=>{
// 		res.render("main/PersonalCenter.html",{
// 			userInfo: req.userInfo,
// 			personalInfo,
// 			categories
// 		})
// 	})
// })
// router.post("/photo_edit", function(req, res) {
// 	let form = new formidable.IncomingForm();
// 	form.encoding = 'utf-8'; // 编码
// 	form.keepExtensions = true; // 保留扩展名
// 	form.multiples=true;//设置为多文件上传
// 	form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小
// 	form.uploadDir = 'public/images/user-photo' // 存储路径
// 	form.parse(req, function(err, fileds, files) { // 解析 formData数据
// 	var hzm=files.img.name
// 		if(hzm.indexOf(".jpg")== -1 ){
// 			return res.json({
// 				msg: "请上传jpg格式的图片",
// 				res_code:"0"
// 			})
// 		}else{
// 			if (err) {
// 				return console.log(err)
// 			}
// 			res.json({
// 				code: files,
// 				msg: "上传头像成功",
// 				res_code:"1"
// 			})
// 			User.findByIdAndUpdate(req.userInfo._id,{
// 				user_photo:files.img.path
// 			},(err,ret)=>{
// 				if(err){
// 					console.log("头像储存失败")
// 				}else{
// 					console.log("头像储存成功")
// 				}
// 			})
// 		}
// 	})
// 
// })
// 
// 
// 
// module.exports = router
// 