var express = require('express')
var User = require('../models/User')
var Category = require('../models/Category')
var Content = require('../models/Content')
var router = express.Router()
var formidable = require('formidable')

router.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
// 	if (!req.userInfo.isAdmin) {
// 		res.send("抱歉，您还不是管理员。。。")
// 	}

	next()
})


router.get("/", function(req, res) {
	res.render("admin/index.html", {
		userInfo: req.userInfo
	})
})

router.get("/user", function(req, res) {
	var page = Number(req.query.page || 1)
	var limit = 5
	// var skip=(page-1)*limit
	var pages
	User.count().then(count => {
		pages = Math.ceil(count / limit) /*向上取整*/
		page = Math.min(page, pages) /*page的值不能超过pages*/
		page = Math.max(page, 1) /*page的值不能小于1*/
		var skip = (page - 1) * limit
		User.find().limit(limit).skip(skip).then(users => {			
			return res.json({users,count})
			res.render("admin/user_index.html", {
				users,
				page,
				multi_page: "user",
				count,
				limit,
				pages
			})
		})

	})


})
/*
 * 从数据库中读取所有的用户数据
 *
 * limit(Number) : 限制获取的数据条数
 *
 * skip(2) : 忽略数据的条数
 * 每页显示2条
 * 1 : 1-2 skip:0 -> (当前页-1) * limit
 * 2 : 3-4 skip:2
 * */
// 用户管理

router.get("/category", function(req, res) {
	var page = Number(req.query.page || 1)
	var limit = 5
	var pages
	Category.count().then(count => { /*count():数据库的总条数*/
		pages = Math.ceil(count / limit) /*向上取整*/
		page = Math.min(page, pages) /*page的值不能超过pages*/
		page = Math.max(page, 1) /*page的值不能小于1*/
		var skip = (page - 1) * limit
		Category.find().sort({
			_id: -1
		}).limit(limit).skip(skip).then(rs => {
			res.json({category: rs,count})
			// res.render("admin/category_index.html", {
			// 	category: rs,
			// 	page,
			// 	count,
			// 	multi_page: "category",
			// 	limit,
			// 	pages
			// })
		})
		/*sort({_id:-1})  根据时间轴排序,1:升序   2:降序*/
	})

})
// 分类首页

router.get("/category/add", function(req, res) {
	res.render("admin/category_add.html", {
		userInfo: req.userInfo
	})
})
// 添加分类

router.post("/category/add", function(req, res) {
	var name = req.body.name
	if (name == "") {
		return res.render("admin/error.html", {
			userInfo: req.userInfo
		})
	}
	// 数据库中是否已经存在相同分类的名称
	Category.findOne({
		name
	}, (err, rs) => {
		if (rs) {
			// res.render("admin/error.html", {
			// 	userInfo: req.userInfo,
			// 	message: "分类已经存在",
			// 	url: "/admin/category"
			// })
			res.json({message: "分类已经存在",msgcode:0})
			return
		} else {
			new Category({
				name
			}).save()
			// res.render("admin/success.html", {
			// 	userInfo: req.userInfo,
			// 	message: "分类保存成功",
			// 	url: "/admin/category"
			// })
			res.json({message: "分类保存成功",msgcode:1})
		}
	})

})
// 分类的保存


router.get("/category/edit", function(req, res) {
	Category.findOne({
			_id: req.query.id
		})
		.then(rs => {
			// res.render("admin/category_edit.html", {
			// 	edit_category: rs
			// })
			res.json({edit_category: rs})
		})
})

router.post("/category/edit", function(req, res) {
	if (req.body.name == "") {
		// res.render("admin/error.html", {
		// 	userInfo: req.userInfo,
		// 	message: "分类名称不能为空",
		// 	url: "/admin/category"
		// })
		return res.json({
			message: "分类名称不能为空",
			msgcode: 0
		})
	}
	Category.findOne({
		name: req.body.name
	}, (err, rs) => {
		if (rs) {
			// res.render("admin/error.html", {
			// 	userInfo: req.userInfo,
			// 	message: "分类已经存在,请重新修改",
			// 	url: "/admin/category"
			// })
			return res.json({
				message: "分类已经存在,请重新修改",
				msgcode: 1
			})
		}
	})
	// req.body.exit_id.replace(/\"/g, "")   正则替换删除''
	Category.findByIdAndUpdate(
		req.body.exit_id.replace(/\"/g, ""), {
			name: req.body.name
		},
		// function(err, suss) {
		// 	if (err) {
		// 		res.render("admin/error.html", {
		// 			userInfo: req.userInfo,
		// 			message: "修改失败，请稍后再试",
		// 			url: "/admin/category"
		// 		})
		// 	} else {
		// 		res.render("admin/success.html", {
		// 			userInfo: req.userInfo,
		// 			message: "修改成功",
		// 			url: "/admin/category"
		// 		})
		// 		
		// 	}
		// }
	).then(()=>{
		res.json({
			message: "修改成功",
			msgcode: 2
		})
	}
	
	)

})
// 分类的编辑


router.get("/category/delete", function(req, res) {
	// console.log(req.query.id)
	Category.remove({
			_id: req.query.id
		},
		function(err, suss) {
			if (err) {
				// res.render("admin/error.html", {
				// 	userInfo: req.userInfo,
				// 	message: "删除失败，请稍后再试",
				// 	url: "/admin/category"
				// })
				res.json({message: "删除失败",msgcode:0})
			} else {
				// res.render("admin/success.html", {
				// 	userInfo: req.userInfo,
				// 	message: "删除成功",
				// 	url: "/admin/category"
				// })
				res.json({message: "删除成功",msgcode:1})
			}
		}
	)
})
// 分类的删除


router.get("/content", (req, res) => {
	var page = Number(req.query.page || 1)
	var limit = 5
	var pages
	Content.count().then(count => {
		pages = Math.ceil(count / limit)
		page = Math.min(page, pages)
		page = Math.max(page, 1)
		var skip = (page - 1) * limit
		Content.find().sort({
			_id: -1
		}).limit(limit).skip(skip).populate(["category", "user"]).then(contents => {
			res.json({contents,count})
			res.render("admin/content_index.html", {
				contents,
				page,
				count,
				multi_page: "content",
				limit,
				pages
			})
		})
		/*sort({_id:-1})  根据时间轴排序,1:升序   2:降序*/
		// populate("")关联的模型表查询
	})
})

router.get("/content/add", (req, res) => {
	Category.find().sort({
		_id: -1
	}).then(category => {
		// res.render("admin/content_add.html", {
		// 	category
		// })
		res.json({category})
	})
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

router.post("/content/add", (req, res) => {
	
	// let form = new formidable.IncomingForm();
	// form.encoding = 'utf-8'; // 编码
	// form.keepExtensions = true; // 保留扩展名
	// form.multiples=true;//设置为多文件上传
	// form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小
	// form.uploadDir = 'public/images/user-photo' // 存储路径
	// form.parse(req, function(err, fileds, files) { // 解析 formData数据
	// var hzm=files.img.name
	// 	if(hzm.indexOf(".jpg")== -1 ){
	// 		return res.json({
	// 			msg: "请上传jpg格式的图片",
	// 			res_code:"0"
	// 		})
	// 	}else{
	// 		if (err) {
	// 			return console.log(err)
	// 		}
	// 		res.json({
	// 			code: files,
	// 			msg: "上传头像成功",
	// 			res_code:"1"
	// 		})
	// 		User.findByIdAndUpdate(req.userInfo._id,{
	// 			user_photo:files.img.path
	// 		},(err,ret)=>{
	// 			if(err){
	// 				console.log("头像储存失败")
	// 			}else{
	// 				console.log("头像储存成功")
	// 			}
	// 		})
	// 	}
	// })
	
	new Content({
		category: req.body.categorys,
		title: req.body.title,
		// user: req.userInfo._id.toString(),
		user: req.body.user,
		views: 0,
		addTime:createTime(),
		description: req.body.description,
		content: req.body.content,
	}).save().then(() => {
		// res.render("admin/success.html", {
		// 	message: "保存成功",
		// 	url: "/admin/content"
		// })
		res.json({
			message: "保存成功",
			msgcode: 1
		})
	})
})
// 内容保存


router.get("/content/edit", (req, res) => {
	Category.find().sort({
		_id: -1
	}).then(category => {
		Content.findOne({
			_id: req.query.id
		}).populate("category").then(content => {
			// res.render("admin/content_edit.html", {
			// 	category,
			// 	content
			// })
			res.json({category,content})
		})
	})
})
// 内容修改

router.post("/content/edit", (req, res) => {
	Content.findByIdAndUpdate(
		req.body.id.replace(/\"/g, ""), {
			// category: req.body.category,
			title: req.body.title,
			description: req.body.description,
			content: req.body.content
		},
		function(err, suss) {
			if (err) {
				// res.render("admin/error.html", {
				// 	userInfo: req.userInfo,
				// 	message: "修改失败，请稍后再试",
				// 	url: "/admin/content"
				// })
				res.json({
					message: "修改失败，请稍后再试",
					msgcode: 0
				})
			} else {
				// res.render("admin/success.html", {
				// 	userInfo: req.userInfo,
				// 	message: "修改成功",
				// 	url: "/admin/content"
				// })
				res.json({
					message: "修改成功",
					msgcode: 1
				})
			}
		}
	)
	
})
// 内容修改

router.get("/content/deleta", (req, res) => {
	Content.remove({
			_id: req.query.id
		},
		function(err, suss) {
			if (err) {
				res.json({message: "删除失败",msgcode:0})
			} else {
				res.json({message: "删除成功",msgcode:1})
			}
		}
	)
})
// 内容删除


module.exports = router
