module.exports = require('./lib/linefoodbot');
var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId:1541948237,
  ChannelSecret:'9a8c7887c8ed7ceb3f963ce8f73d64a9',
  ChannelAccessToken:'3cL4zroJybMhWDUTZPUnLbxzPjfsoNu5FO0EqmZ/fhOka8bgzPZBCCp2EkmVw4l5lRUhDRML3vSuT9wV+VUd/xzw02X6FL6nFi8LaaT8NDuJcNJaaIIyNDzB/C5dfeU21BS73yzS3jQ88fmlwQS1VAdB04t89/1O/w1cDnyilFU='
});
