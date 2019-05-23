var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Cookies = require('cookies')
var User = require('./models/User')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
// 开放静态资源

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录
// 模板引擎配置

// app.use(bodyParser.urlencoded({
// 	extended: false
// }))
// app.use(bodyParser.json())

app.use(bodyParser.json({limit: '50mb'}));    //最大上传大小不超过50mb
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended:true
}));

// 配置解析表单 POST 请求体插件 需在 app.use(router) 之前

app.use(function(req,res,next){

	// res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	// res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	req.cookies=new Cookies(req,res)
	req.userInfo=req.cookies.get('userInfo')
	next()

// 	req.cookies=new Cookies(req,res)
// 	req.userInfo={}
// 	if(req.cookies.get('userInfo')){
// 			req.userInfo=JSON.parse(req.cookies.get('userInfo'))		
// 			// 获取当前登录用户的类型,是否为管理员
// 			User.findById(req.userInfo._id).then(userInfo=>{
// 				req.userInfo.isAdmin=Boolean(userInfo.isAdmin)
// 				next()
// 			})		
// 	}else{
// 		next()
// 	}
})
// 设置cookies中间键 


app.use('/', require('./routers/main'))
app.use('/api', require('./routers/api'))
app.use('/admin', require('./routers/admin')) 
// app.use('/p', require('./routers/photo')) 
// app.use(router)
// 把路由挂载到 app 中


mongoose.connect('mongodb://localhost:27017/blog', function(error) {
	if (error) {
		console.log("数据库连接失败")
	} else {
		console.log("数据库连接成功")
		app.listen(8088, () => {
			console.log("port is running 8088..")
		})
	}
})
