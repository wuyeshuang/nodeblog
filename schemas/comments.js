var mongoose = require('mongoose')

//内容的表结构
module.exports = new mongoose.Schema({
	
	user_link: {
		// 类型
		type: mongoose.Schema.Types.ObjectId,
		// 引用:另外一张表的模型
		ref: "User"
	},

	// 关联字段，内容分类的id
	contents_link: {
		// 类型
		type: mongoose.Schema.Types.ObjectId,
		// 引用:另外一张表的模型
		ref: "Content"
	},

	// 评论
	comments: {
		type: Array,
		default: []
	}

})
