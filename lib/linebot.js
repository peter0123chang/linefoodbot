'use strict';

const EventEmitter = require('events');
const fetch = require('node-fetch');
const crypto = require('crypto');
const http = require('http');
const bodyParser = require('body-parser');

var linebot = require('linebot');
var express = require('express');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var bot = linebot({
  channelId: '1541948237',
  channelSecret: '9a8c7887c8ed7ceb3f963ce8f73d64a9',
  channelAccessToken: '3cL4zroJybMhWDUTZPUnLbxzPjfsoNu5FO0EqmZ/fhOka8bgzPZBCCp2EkmVw4l5lRUhDRML3vSuT9wV+VUd/xzw02X6FL6nFi8LaaT8NDuJcNJaaIIyNDzB/C5dfeU21BS73yzS3jQ88fmlwQS1VAdB04t89/1O/w1cDnyilFU='
});

var myClientSecret={"installed":{"client_id":"850824140147-oj4e40n9r73fggk4btnnm7m01sp8l13l.apps.googleusercontent.com","project_id":"fine-iterator-147008","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"GWzuZaS8gGmUsjC_T5eR0DhW","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}};

var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(myClientSecret.installed.client_id,myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);

oauth2Client.credentials ={"access_token":"ya29.GlvsBHdqb5hrgML0chesDxODZCvLYzJc9Gl5STeEzclUU8gd4s_NBfcIrlSBGkbRB7ZGpoVrgnczuRHCBsCiWKvxQ_gfGpbfOxb_fw-CGDUSwz2ww10S8S_NqWyh","refresh_token":"1/taczb5UflFAWqxY_I7WPtJwhiv_r2OaUpvUDbx1oDPE","token_type":"Bearer","expiry_date":1508668680319}

var mySheetId='2PACX-1vQ0469-rXtpbjZlWUy2x7Qp4rbKkM1RkWzrzRFGCEFV2VNwK3rPCurQZRgb--Vk557qRVKN97JCzoQc';

var myQuestions=[];
var users=[];
var totalSteps=0;
var myReplies=[];

function verify(rawBody, signature) {
		const hash = crypto.createHmac('sha256', this.options.channelSecret)
			.update(rawBody, 'utf8')
			.digest('base64');
		return hash === signature;
	}
	function parse(body) {
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
/*
function getQuestions() {
  var sheets =google.sheets('v4');
  sheets.spreadsheets.values.get({auth:oauth2Client,spreadsheetId:mySheetId,range:encodeURI('QNA')},function(err,response){if(err){console.log(sheets.spreadsheets.values+'讀取問題檔的API產生問題：' + err);return;}
     var rows = response.values;
     if(rows.length==0){
        console.log('No data found.');
     }
     else{
       myQuestions=rows;
       totalSteps=myQuestions[0].length;
       console.log('要問的問題已下載完畢！');
     }
  });
}

function appendMyRow(userId) {
   var request = {
      auth: oauth2Client,
      spreadsheetId: mySheetId,
      range:encodeURI('FORM1'),
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'RAW',
      resource: {
        "values": [
          users[userId].replies
        ]
      }
   };
   var sheets = google.sheets('v4');
   sheets.spreadsheets.values.append(request, function(err, response) {
      if (err) {
         console.log('The API returned an error: ' + err);
         return;
      }
   });
}
//getQuestions();
bot.on('message', function(event) { 
   if ((event.message.text == 'Lunch')&&(event.message.type === 'text')){
      var myId=event.source.userId;
      if (users[myId]==undefined){
         users[myId]=[];
         users[myId].userId=myId;
         users[myId].step=-1;
         users[myId].replies=[];
      }
      var myStep=users[myId].step;
      if (myStep===-1)
         {sendMessage(event,myQuestions[0][0]);}
      else{
         if (myStep==(totalSteps-1))
         {sendMessage(event,myQuestions[1][myStep]);}
         else
         {sendMessage(event,myQuestions[1][myStep]+'\n'+myQuestions[0][myStep+1]);}
         users[myId].replies[myStep+1]=event.message.text;
      }
      myStep++;
      users[myId].step=myStep;
      if (myStep>=totalSteps){
         myStep=-1;
         users[myId].step=myStep;
         users[myId].replies[0]=new Date();
         appendMyRow(myId);
      }
   }
});


function sendMessage(eve,msg){eve.reply(msg).then(function(data){return true;}).catch(function(error){return false;});}

*/
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


var server = app.listen(process.env.PORT || 8080, function() {var port = server.address().port; console.log("App now running on port", port);});
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
			res.setHeader('X-Powered-By', 'LineFoodBot');
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
module.exports.LineFoodBot = LineBot;
