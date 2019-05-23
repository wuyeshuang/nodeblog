var express = require('express')
var Category = require('../models/Category')
var Content = require('../models/Content')
var Comment = require('../models/Comment')
var fs = require('fs')
var path = require('path')
var User = require('../models/User')
var formidable = require('formidable')
var router = express.Router()

var userId = "111"

// 中间键处理导航分类的通用数据
var categories = {}
router.use(function(req, res, next) {

	res.header("Access-Control-Allow-Origin", req.headers.origin);
	// res.header("Access-control-expose-headers", "Authorization");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	Category.find().then((categorie) => {
		categories = categorie;
		next();
	});
});

router.get('/userInfo', (req, res) => {
	User.find().then(ret => {
		return res.json({
			ret
		})
	})
})

router.get('/', (req, res) => {
	var page = Number(req.query.page || 1)
	var category = req.query.category || ""
	var limit = 4
	var pages
	var where = {}
	if (category) {
		where.category = category
	}
	Content.where(where).count().then(count => {
		pages = Math.ceil(count / limit)
		page = Math.min(page, pages)
		page = Math.max(page, 1)
		var skip = (page - 1) * limit
		Content.where(where).find().sort({
			_id: -1
		}).limit(limit).skip(skip).populate("user").then(contents => {
			////
			return res.json({
				categories,
				contents,
				count
			})
			////
			res.render("main/index.html", {
				userInfo: req.userInfo,
				categories,
				category,
				contents,
				page,
				count,
				limit,
				pages
			})

		})
	})
})


router.get("/view", (req, res) => {
	Content.findOne({
		_id: req.query.category
	}).populate("user").then(content => {
		content.views++
		content.save()
		Comment.find({
				contents_link: req.query.category
			}).sort({
				_id: -1
			}).populate(["user_link", "contents_link"])
			.then(ret => {
				return res.json({
					content,
					ret
				})
				// 			res.render("main/view.html", {
				// 				userInfo: req.userInfo,
				// 				ret,
				// 				content,
				// 				categories
				// 			})
			})
	})
})

router.get("/search", (req, res) => {
	Content.find({
			$or: [{
					title: {
						$regex: req.query.search
					}
				},
				{
					content: {
						$regex: req.query.search
					}
				},
				{
					description: {
						$regex: req.query.search
					}
				}
			]
		}, {
			password: 0
		}).sort({
			_id: -1
		}).populate("user")
		.then(result => {
			res.json({
				result
			})
		})
})
//搜索



router.get("/personal", (req, res) => {
	User.findOne({
		_id: req.userInfo
	}).then(personalInfo => {
		res.render("main/PersonalCenter.html", {
			userInfo: req.userInfo,
			personalInfo,
			categories
		})
	})
})
router.get("/photo_edit", (req, res) => {
	userId = req.query._id
	User.findOne({_id:userId}).then(result=>{
		res.json({result})
	})
})
router.post("/photo_edit", function(req, res) {


	var form = new formidable.IncomingForm();
	form.encoding = 'utf-8'; // 编码
	form.keepExtensions = true; // 保留扩展名
	form.multiples = false; //是否设置为多文件上传
	form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小
	form.uploadDir = 'public/images/user-photo' // 存储路径

	form.parse(req, function(err, fileds, files) { // 解析 formData数据

		User.findByIdAndUpdate(userId, {
			user_photo: "/"+files.img.path
		}).then(result => {
			res.json({
				result
			})
		})
	})

})

// function getNowFormatDate() {
//     var date = new Date();
//     var seperator1 = "-";
//     var month = date.getMonth() + 1;
//     var strDate = date.getDate();
//     if (month >= 1 && month <= 9) {
//         month = "0" + month;
//     }
//     if (strDate >= 0 && strDate <= 9) {
//         strDate = "0" + strDate;
//     }
//     var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
//     return currentdate.toString();
// }
// var datatime = 'public/images/'+getNowFormatDate();
// //将图片放到服务器
// var multer = require('multer')
// var storage = multer.diskStorage({
//     // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
//     destination: datatime,
//     //给上传文件重命名，获取添加后缀名
//     filename: function (req, file, cb) {
//         cb(null,  file.originalname);
//      }
// }); 
// var upload = multer({
//     storage: storage
// });
// 
// router.post('/addPicture',upload.single('picUrl'),function(req,res,next){
//      console.log(req.file)
// 		//req.file文件的具体信息
//     res.json({ret_code: req.file});
// 		// res.redirect("/")
// });

// function getNowFormatDate() {
// 	var date = new Date();
// 	var seperator1 = "-";
// 	var month = date.getMonth() + 1;
// 	var strDate = date.getDate();
// 	if (month >= 1 && month <= 9) {
// 		month = "0" + month;
// 	}
// 	if (strDate >= 0 && strDate <= 9) {
// 		strDate = "0" + strDate;
// 	}
// 	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
// 	return currentdate.toString();
// }
// var datatime = 'public/images/' + getNowFormatDate();
// var multer = require('multer')
// var storage = multer.diskStorage({
// 	//创建文件夹
// 	destination: datatime,
// 	filename: function(req, file, cb) {
// 		cb(null, file.originalname);
// 	}
// });
// var upload = multer({
// 	storage: storage
// });
// router.post("/test", function(req, res) {
// 	// 跨域
// 	//res.header("Access-Control-Allow-Origin", "*");
// 	//res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
// 	//res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
// 	let form = new formidable.IncomingForm();
// 	form.encoding = 'utf-8'; // 编码
// 	form.keepExtensions = true; // 保留扩展名
// 	form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小
// 	form.uploadDir = datatime // 存储路径
// 	form.parse(req, function(err, fileds, files) { // 解析 formData数据
// 		if (err) {
// 			return console.log(err)
// 		}
// 		let imgPath = files.img.path // 获取文件路径
// 		let imgName = "./test." + files.img.type.split("/")[1] // 修改之后的名字
// 		let data = fs.readFileSync(imgPath) // 同步读取文件
// 		fs.writeFile(imgName, data, function(err) { // 存储文件
// 			if (err) {
// 				return console.log(err)
// 			}
// 			res.json({
// 				code: files
// 			})
// 		})
// 	})
// 
// })


module.exports = router
