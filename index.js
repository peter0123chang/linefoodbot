var linebot = require('linebot');
var express = require('express');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var bot = linebot({
  channelId: '1541948237',
  channelSecret: '9a8c7887c8ed7ceb3f963ce8f73d64a9',
  channelAccessToken: '3cL4zroJybMhWDUTZPUnLbxzPjfsoNu5FO0EqmZ/fhOka8bgzPZBCCp2EkmVw4l5lRUhDRML3vSuT9wV+VUd/xzw02X6FL6nFi8LaaT8NDuJcNJaaIIyNDzB/C5dfeU21BS73yzS3jQ88fmlwQS1VAdB04t89/1O/w1cDnyilFU='
});

var myClientSecret={"installed":{"client_id":"850824140147-oj4e40n9r73fggk4btnnm7m01sp8l13l.apps.googleusercontent.com","project_id":"fine-iterator-147008","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"GWzuZaS8gGmUsjC_T5eR0DhW","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}

var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(myClientSecret.installed.client_id,myClientSecret.installed.client_secret, myClientSecret.installed.redirect_uris[0]);

oauth2Client.credentials ={"access_token":"ya29.GlvsBHdqb5hrgML0chesDxODZCvLYzJc9Gl5STeEzclUU8gd4s_NBfcIrlSBGkbRB7ZGpoVrgnczuRHCBsCiWKvxQ_gfGpbfOxb_fw-CGDUSwz2ww10S8S_NqWyh","refresh_token":"1/taczb5UflFAWqxY_I7WPtJwhiv_r2OaUpvUDbx1oDPE","token_type":"Bearer","expiry_date":1508668680319}

var mySheetId='e/2PACX-1vQ0469-rXtpbjZlWUy2x7Qp4rbKkM1RkWzrzRFGCEFV2VNwK3rPCurQZRgb--Vk557qRVKN97JCzoQc';

var myQuestions=[];
var users=[];
var totalSteps=0;
var myReplies=[];

getQuestions();


function getQuestions() {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
     auth: oauth2Client,
     spreadsheetId: mySheetId,
     range:encodeURI('問題')},
     function(err, response) {if(err){console.log('讀取問題檔的API產生問題：' + err);return;}
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
      range:encodeURI('表單回應 1'),
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'RAW',
      resource: {
        "values": [
          users[userId].replies
        ]
      }
   };
   var sheets = google.sheets('v2');
   sheets.spreadsheets.values.append(request, function(err, response) {
      if (err) {
         console.log('The API returned an error: ' + err);
         return;
      }
   });
}

bot.on('message', function(event) {
   if (event.message.type === 'text') {
      var myId=event.source.userId;
      if (users[myId]==undefined){
         users[myId]=[];
         users[myId].userId=myId;
         users[myId].step=-1;
         users[myId].replies=[];
      }
      var myStep=users[myId].step;
      if (myStep===-1)
         sendMessage(event,myQuestions[0][0]);
      else{
         if (myStep==(totalSteps-1))
            sendMessage(event,myQuestions[1][myStep]);
         else
            sendMessage(event,myQuestions[1][myStep]+'\n'+myQuestions[0][myStep+1]);
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


function sendMessage(eve,msg){
   eve.reply(msg).then(function(data){return true;}).catch(function(error){return false;});
}


const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
