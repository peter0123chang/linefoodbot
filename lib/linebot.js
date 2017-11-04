'use strict';
var express = require('express');
const EventEmitter = require('events');
const fetch = require('node-fetch');
const crypto = require('crypto');
const http = require('http');
const bodyParser = require('body-parser');
var linebot = require('linebot');
var server = app.listen(process.env.PORT || 8080, function() {var port = server.address().port; console.log("App now running on port", port);});
 // var CHANNEL_ID= '1541948237';
//  var CHANNEL_SECRET= '9a8c7887c8ed7ceb3f963ce8f73d64a9';
//  var CHANNEL_ACCESS_TOKEN= '3cL4zroJybMhWDUTZPUnLbxzPjfsoNu5FO0EqmZ/fhOka8bgzPZBCCp2EkmVw4l5lRUhDRML3vSuT9wV+VUd/xzw02X6FL6nFi8LaaT8NDuJcNJaaIIyNDzB/C5dfeU21BS73yzS3jQ88fmlwQS1VAdB04t89/1O/w1cDnyilFU=';
var bot = linebot({
	channelId: '1541948237',
	ChannelSecret: '9a8c7887c8ed7ceb3f963ce8f73d64a9',
	ChannelAccessToken: '3cL4zroJybMhWDUTZPUnLbxzPjfsoNu5FO0EqmZ/fhOka8bgzPZBCCp2EkmVw4l5lRUhDRML3vSuT9wV+VUd/xzw02X6FL6nFi8LaaT8NDuJcNJaaIIyNDzB/C5dfeU21BS73yzS3jQ88fmlwQS1VAdB04t89/1O/w1cDnyilFU=',
	verify: true // Verify 'X-Line-Signature' header (default=true)
});
class LineBot extends EventEmitter {

	constructor(options) {
		super();
		this.options = options || {};
		this.options.channelId = options.channelId || '1541948237';
		this.options.ChannelSecret = options.ChannelSecret || '9a8c7887c8ed7ceb3f963ce8f73d64a9';
		this.options.ChannelAccessToken = options.ChannelAccessToken || '3cL4zroJybMhWDUTZPUnLbxzPjfsoNu5FO0EqmZ/fhOka8bgzPZBCCp2EkmVw4l5lRUhDRML3vSuT9wV+VUd/xzw02X6FL6nFi8LaaT8NDuJcNJaaIIyNDzB/C5dfeU21BS73yzS3jQ88fmlwQS1VAdB04t89/1O/w1cDnyilFU=';
		if (this.options.verify === undefined) {
			this.options.verify = true;
		}
		this.headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + this.options.ChannelAccessToken
		};
		this.endpoint = 'https://api.line.me/v2/bot';
	}

	verify(rawBody, signature) {
		//const hash = crypto.createHmac('sha256', this.options.ChannelSecret)
		const hash = crypto.createHmac('sha256','3cL4zroJybMhWDUTZPUnLbxzPjfsoNu5FO0EqmZ/fhOka8bgzPZBCCp2EkmVw4l5lRUhDRML3vSuT9wV+VUd/xzw02X6FL6nFi8LaaT8NDuJcNJaaIIyNDzB/C5dfeU21BS73yzS3jQ88fmlwQS1VAdB04t89/1O/w1cDnyilFU=')
			.update(rawBody, 'utf8')
			.digest('base64');
		return hash === signature;
	}

	parse(body) {
		const that = this;
		if (!body || !body.events) {
			return;
		}
		body.events.forEach(function (event) {
			event.reply = function (message) {
				return that.reply(event.replyToken, message);
			};
			if (event.source) {
				event.source.profile = function () {
					return that.getUserProfile(event.source.userId);
				};
			}
			if (event.message) {
				event.message.content = function () {
					return that.getMessageContent(event.message.id);
				};
			}
			process.nextTick(function () {
				that.emit(event.type, event);
			});
		});
	}

	static createMessages(message) {
		if (typeof message === 'string') {
			return [{ type: 'text', text: message }];
		}
		if (Array.isArray(message)) {
			return message.map(function (m) {
				if (typeof m === 'string') {
					return { type: 'text', text: m };
				}
				return m;
			});
		}
		return [message];
	}

	reply(replyToken, message) {
		const body = {
			replyToken: replyToken,
			messages: LineBot.createMessages(message)
		};
		return this.post('/message/reply', body).then(function (res) {
			return res.json();
		});
	}

	push(to, message) {
		if (Array.isArray(to)) {
			return Promise.all(to.map(recipient => this.push(recipient, message)));
		}
		const body = {
			to: to,
			messages: LineBot.createMessages(message)
		};
		return this.post('/message/push', body).then(function (res) {
			return res.json();
		});
	}

	multicast(to, message) {
		const body = {
			to: to,
			messages: LineBot.createMessages(message)
		};
		return this.post('/message/multicast', body).then(function (res) {
			return res.json();
		});
	}

	getUserProfile(userId) {
		return this.get('/profile/' + userId).then(function (res) {
			return res.json();
		});
	}

	getMessageContent(messageId) {
		return this.get('/message/' + messageId + '/content/').then(function (res) {
			return res.buffer();
		});
	}

	leaveGroup(groupId) {
		return this.post('/group/' + groupId + '/leave/').then(function (res) {
			return res.json();
		});
	}

	leaveRoom(roomId) {
		return this.post('/room/' + roomId + '/leave/').then(function (res) {
			return res.json();
		});
	}

	get(path) {
		return fetch(this.endpoint + path, { method: 'GET', headers: this.headers });
	}

	post(path, body) {
		return fetch(this.endpoint + path, { method: 'POST', headers: this.headers, body: JSON.stringify(body) });
	}

	// Optional Express.js middleware
	parser() {
		const parser = bodyParser.json({
			verify: function (req, res, buf, encoding) {
				req.rawBody = buf.toString(encoding);
			}
		});
		return (req, res) => {
			parser(req, res, () => {
				if (this.options.verify && !this.verify(req.rawBody, req.get('X-Line-Signature'))) {
					return res.sendStatus(400);
				}
				this.parse(req.body);
				return res.json({});
			});
		};
	}

	// Optional built-in http server
	listen(path, port, callback) {
		const parser = bodyParser.json({
			verify: function (req, res, buf, encoding) {
				req.rawBody = buf.toString(encoding);
			}
		});
		const server = http.createServer((req, res) => {
			const signature = req.headers['x-line-signature']; // Must be lowercase
			res.setHeader('X-Powered-By', 'LineBot');
			if (req.method === 'POST' && req.url === path) {
				parser(req, res, () => {
					if (this.options.verify && !this.verify(req.rawBody, signature)) {
						res.statusCode = 400;
						res.setHeader('Content-Type', 'text/html; charset=utf-8');
						return res.end('Bad request');
					}
					this.parse(req.body);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					return res.end('{}');
				});
			} else {
				res.statusCode = 404;
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				return res.end('Not found');
			}
		});
		return server.listen(port, callback);
	}

} // class LineBot

function createBot(options) {
	return new LineBot(options);
}

module.exports = createBot;
module.exports.LineBot = LineBot;
//var server = app.listen(process.env.PORT || 8080, function() {var port = server.address().port; console.log("App now running on port", port);});
