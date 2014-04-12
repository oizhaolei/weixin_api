/**
 * Weixin api 
 * Copyright(c) 2014 Jeremy Wei <shuimuqingshu@gmail.com>
 * MIT Licensed
 */
var sha1 = require('sha1'),
  events = require('events'),
  emitter = new events.EventEmitter(),
  message = require('./message'),
  HTTP = require('./http');

var http = null;
var Weixin = function() {
	this.token = '';
}

module.exports = new Weixin();

/**
 * 签名校验
 * 
 * @param {Object} req 请求对象
 * @api public
 */
Weixin.prototype.checkSignature = function(req) {
  var http = new HTTP(req);
	
	// 按照字典排序
	var array = [this.token, http.params.timestamp, http.params.nonce];
	array.sort();
	
	// 连接
	var str = sha1(array.join(""));
	
	// 对比签名
	if(str == http.params.signature) {
		return true;
	} else {
		return false;
	}
}

/**
 * 开始监听微信消息
 * 
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @api public
 */
Weixin.prototype.listen = function(req, res) {
  http = new HTTP(req, res);
  http.in(function (data) {
    message.requestMessage(data, function (err, msg) {
      var eventName = msg.msgType + 'MessageComing';
      emitter.emit(eventName, msg);
    });
  });
}

// 向后兼容
Weixin.prototype.loop = Weixin.prototype.listen;

/**
 * 发送信息
 * 
 * @param {Object} msg 消息对象
 * @api public
 */
Weixin.prototype.sendMsg = function(data) {
  message.responseMessage(data, function (err, msg) {
    http.out(msg);
  });
}

/**
 * 监听消息
 * 
 * weixin.message('text', function(msg, err){
 *  if (err) throw err;
 *  // do with msg
 * });
 *
 * @param {String} type 
 * @param {Function} callback 
 * @api public
 */
Weixin.prototype.message = function(type, callback) {
  var eventName = '';
  
  if (!type) {
    callback(null, new Error('listen message type is missing'));
    return this;
  }
  
  type = type.toLowerCase();
  
  if (['text', 'image', 'location', 'link', 'event'].indexOf(type) === -1) {
    callback(null, new Error('listen message type invalid'));
  } else {
    eventName = type + 'MessageComing';
    emitter.on(eventName, callback);
  }
  	
	return this;
}

// ------------------- 以下消息监听方法为向后兼容，不推荐使用 -----------------
/**
 * 监听文本消息[向后兼容]
 * 
 * weixin.textMsg(function(msg) {
 *  // do with msg
 * });
 *
 * @param {Function} callback 
 * @api public
 */
Weixin.prototype.textMsg = function(callback) {
  
  this.message('text', callback);
	return this;
}

/**
 * 监听图片消息
 * 
 * weixin.imageMsg(function(msg){
 *  // do with msg
 * });
 *
 * @param {Function} callback 
 * @api public
 */
Weixin.prototype.imageMsg = function(callback) {
	
  this.message('image', callback);
	return this;
}

/**
 * 监听地理位置消息
 * 
 * weixin.locationMsg(function(msg){
 *  // do with msg
 * });
 *
 * @param {Function} callback 
 * @api public
 */
Weixin.prototype.locationMsg = function(callback) {
	
  this.message('location', callback);	
	return this;
}

/**
 * 监听链接消息
 * 
 * weixin.urlMsg(function(msg){
 *  // do with msg
 * });
 *
 * @param {Function} callback 
 * @api public
 */
Weixin.prototype.urlMsg = function(callback) {
	
  this.message('link', callback);		
	return this;
}

Weixin.prototype.linkMsg = Weixin.prototype.urlMsg;

/**
 * 监听事件消息
 * 
 * weixin.eventMsg(function(msg){
 *  // do with msg
 * });
 *
 * @param {Function} callback 
 * @api public
 */
Weixin.prototype.eventMsg = function(callback) {
	
  this.message('event', callback);		
	return this;
}