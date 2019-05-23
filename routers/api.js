var express = require('express')
var User = require('../models/User')
// var md5 = require('blueimp-md5')
var Content = require('../models/Content')
var Comment = require('../models/Comment')
var router = express.Router()

router.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	next()
})

router.post('/user/register', (req, res) => {
	if (req.body.username == "") {
		return res.json({
			res_code: "1",
			message: "用户名输入为空"
		})
	} else if (req.body.password == "") {
		return res.json({
			res_code: "2",
			message: "密码输入为空"
		})
	} else if (req.body.repassword !== req.body.password) {
		return res.json({
			res_code: "3",
			message: "两次输入的密码不一致"
		})
	} else {

		User.findOne({
				username: req.body.username
			},
			function(err, ret) {
				if (err) {
					return console.log("数据库错误");
				} else if (ret) {
					// console.log(ret)
					return res.json({
						res_code: "5",
						message: "用户已存在"
					})
				} else {
					// req.body.password = md5(md5(req.body.password))
					var admin = new User(req.body)
					admin.save(function(err, ret) {
						if (err) {
							return res.json({
								res_code: "4",
								message: "保存失败"
							})
						} else {
							return res.json({
								res_code: "0",
								message: "保存成功"
							})
						}
					});
				}
			});
	}
})

router.post('/user/login', (req, res) => {
	var username=req.body.username
	var password=req.body.password
// 	var userInfo={}
// 	userInfo.name=req.body.username
	if(username==""){
		return res.json({
			res_code:"1",
			message: "用户名不能为空"
		})
	}else if(password==""){
		return res.json({
			res_code:"2",
			message: "密码不能为空"
		})
	}else{
		User.findOne({
			username,
			password
		}).then(userInfo=>{
			if(!userInfo){
				return res.json({
					res_code:"3",
					message: "用户名或密码错误"
				})
			}else{
				req.cookies.set('userInfo',JSON.stringify({
					_id:userInfo.id,
					username:userInfo.username,
				}))
				return res.json({
					res_code:"0",
					message: "登录成功",
					userInfo
				})
			}
		})


	}
})

// 退出登录
router.get('/user/logout', (req, res) => {
	req.cookies.set('userInfo', null)
	return res.json({res_code:"0"})
})

function createTime(){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	return year+'年'+month+'月'+day+'日 '+hour+':'+minute+':'+second;
}

// 提交评论
router.post('/comment/post', (req, res) =>{
	var contentId=req.body.contentid || ''
	var contentInfo=req.body.contentInfo.replace(/\"/g, "") || ''
	var postData={
		username: req.body.username,
		postTime: createTime(),
		content: req.body.content
	}
	new Comment({
		user_link:contentId,
		contents_link:contentInfo,
		comments:postData
	}).save((err,succ)=>{
		if(err){
			console.log("保存失败")
		}else if(succ){
			console.log("保存成功")
		}
	})
// 	Comment.find({contents_link:contentInfo}).populate(["user_link","contents_link"])
// 	.then(ret=>{
// 		res.json({ret})
// 	})
})

router.post("/basicInfo",(req,res)=>{
	User.findByIdAndUpdate(req.body._id, {
		realname: req.body.realname,
		gender: req.body.gender,
		age: req.body.age,
		industry: req.body.industry,
		introduce: req.body.introduce
	}).then(result=>{
		res.json({
			msg:"修改成功",
			msgcode:1
		})
	})
})

router.post("/changePassword",(req,res)=>{
	User.findOne({
	_id:req.body._id,
	password:req.body.password1})
	.then(ret=>{
		if(!ret){
			res.json({
				msg:"密码错误",
				msgcode:0
			})
		}else{
			User.findByIdAndUpdate(req.body._id,{password:req.body.password2})
			.then(result=>{
				console.log("")
			})
			res.json({
				msg:"密码正确",
				msgcode:1
			})
		}
	})
})


module.exports = router
