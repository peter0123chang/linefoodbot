
  var CHANNEL_ID= '1541948237';
  var CHANNEL_SECRET= '9a8c7887c8ed7ceb3f963ce8f73d64a9';
  var CHANNEL_ACCESS_TOKEN= '3cL4zroJybMhWDUTZPUnLbxzPjfsoNu5FO0EqmZ/fhOka8bgzPZBCCp2EkmVw4l5lRUhDRML3vSuT9wV+VUd/xzw02X6FL6nFi8LaaT8NDuJcNJaaIIyNDzB/C5dfeU21BS73yzS3jQ88fmlwQS1VAdB04t89/1O/w1cDnyilFU=';
var bot = linebot({
	channelId: CHANNEL_ID,
	ChannelSecret: CHANNEL_SECRET,
	ChannelAccessToken: CHANNEL_ACCESS_TOKEN,
	verify: true // Verify 'X-Line-Signature' header (default=true)
});
