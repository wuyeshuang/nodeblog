var mongoose = require('mongoose')

//内容的表结构
module.exports = new mongoose.Schema({

	// 关联字段，内容分类的id
	category: {
		// 类型
		type: mongoose.Schema.Types.ObjectId,
		// 引用:另外一张表的模型
		ref: "Category"
	},

	// 内容标题
	title: String,

	//添加时间
	addTime: {
		// type: Date,
		type: String,
		// 注意：这里不要写 Date.now() 因为会即刻调用
		// 这里直接给了一个方法：Date.now
		// 当你去 new Model 的时候，如果你没有传递 create_time ，则 mongoose 就会调用 default 指定的Date.now 方法，使用其返回值作为默认值
		// default: Date.now
	},

	//阅读量
	views: {
		type: Number
	},

	// 简介
	description: {
		type: String,
		default: ""
	},

	// 内容
	content: {
		type: String,
		default: ""
	},
	
	// 关联字段，用户分类的用户名
	user: {
		// 类型
		type: mongoose.Schema.Types.ObjectId,
		// 引用:另外一张表的模型
		ref: "User"
	}

})
