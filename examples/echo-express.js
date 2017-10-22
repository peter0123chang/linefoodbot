const linefoodbot = require('../index.js');
const express = require('express');

const bot = linefoodbot({
	channelId: process.env.CHANNEL_ID,
	ChannelSecret: process.env.CHANNEL_SECRET,
	ChannelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

const linebotParser = bot.parser();

app.post('/linewebhook', linebotParser);
/*
bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
*/
bot.on('message', function (event) {
	event.reply(event.message.text).then(function (data) {
		console.log('Success', data);
	}).catch(function (error) {
		console.log('Error', error);
	});
});

app.listen(process.env.PORT || 8080, function () {
	console.log('LineBot is running.');
});
