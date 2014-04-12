/**
 * weixin-api example for express
 *
 * Copyright(c) 2014 Jeremy Wei <shuimuqingshu@gmail.com>
 * 
 * MIT Licensed
 *
 */
var express = require('express'),
	weixin = require('weixin-api'),
	app = express();
	
// config
weixin.token = 'your token';

// 解析器
app.use(express.bodyParser());

// 接入验证
app.get('/', function(req, res) {
  weixin.signature(req, res);
});

// 监听文本消息
weixin.message('text', function(msg, err) {
	console.log("textMsg received");
	console.log(JSON.stringify(msg));
	
	var resMsg = {};
	
	switch (msg.content) {
		case "文本" :
			resMsg = {
				fromUserName : msg.toUserName,
				toUserName : msg.fromUserName,
				msgType : "text",
				content : "(╯°□°）╯︵ ┻━┻",
				funcFlag : 0
			};
			break;
		
		case "音乐" :
			resMsg = {
				fromUserName : msg.toUserName,
				toUserName : msg.fromUserName,
				msgType : "music",
				title : "向往",
				description : "李健《向往》",
				musicUrl :　"",
				HQMusicUrl :"",
				funcFlag : 0
			};
			break;
			
		case "图文" :
			var articles = [];
			articles[0] = {
				title : "PHP依赖管理工具Composer入门",
				description : "PHP依赖管理工具Composer入门",
				picUrl : "http://weizhifeng.net/images/tech/composer.png",
				url : "http://weizhifeng.net/manage-php-dependency-with-composer.html"
			};
	
			articles[1] = {
				title : "八月西湖",
				description : "八月西湖",
				picUrl : "http://weizhifeng.net/images/poem/bayuexihu.jpg",
				url : "http://weizhifeng.net/bayuexihu.html"
			};
	
			articles[2] = {
				title : "「翻译」Redis协议",
				description : "「翻译」Redis协议",
				picUrl : "http://weizhifeng.net/images/tech/redis.png",
				url : "http://weizhifeng.net/redis-protocol.html"
			};
		
			// 返回图文消息
			resMsg = {
				fromUserName : msg.toUserName,
				toUserName : msg.fromUserName,
				msgType : "news",
				articles : articles,
				funcFlag : 0
			}
			break;
			
		default : 
			resMsg = {
				fromUserName : msg.toUserName,
				toUserName : msg.fromUserName,
				msgType : "text",
				content : "「展卷知千秋 观雨识江南」，幸会。",
				funcFlag : 0
			};
	}
	
	weixin.sendMsg(resMsg);
});

// chain 
weixin.message('image', function(msg, err) {
	console.log("imageMsg received");
	console.log(JSON.stringify(msg));
  
}).message('location', function(msg) {
	console.log("locationMsg received");
	console.log(JSON.stringify(msg));
  
}).message('link', function(msg) {
	console.log("urlMsg received");
	console.log(JSON.stringify(msg));
  
}).message('event', function(msg) {
	console.log("eventMsg received");
	console.log(JSON.stringify(msg));
	
	var resMsg = {
		fromUserName : msg.toUserName,
		toUserName : msg.fromUserName,
		msgType : "text",
		content : "欢迎订阅，幸会。",
		funcFlag : 0
	};
	
	weixin.sendMsg(resMsg);
});

// Start
app.post('/', function(req, res) {
		
	// listen
	weixin.listen(req, res);
	
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});