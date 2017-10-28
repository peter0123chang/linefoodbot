const request = require('request-promise');
const CustomError = require('../../config/customError');

const self = module.exports = {
  isFakeReply: (replyToken) => {
    // This tokens are fake from Test of Line Webhooks.
    const isFakeReply = !!(replyToken === '00000000000000000000000000000000' || replyToken === 'ffffffffffffffffffffffffffffffff');
    return isFakeReply;
  },
  checkRequestEventsCount: (requestEvents) => {
    const result = { isPass: true, error: null };

    if (!Array.isArray(requestEvents)) {
      result.isPass = false;
      result.error = new CustomError('The request\'s event need an Array.', 400);
    } else if (requestEvents.length > 5) {
      result.isPass = false;
      result.error = new CustomError('Bad Request! Too many request events.', 400);
    }

    return result;
  },
  createReplyRequest: (auth, replyMessage) => {
    let options = lineRequest(auth, 'reply');
    options.body = {
      replyToken: replyMessage.replyToken,
      messages: self.createReplyMessageContents(replyMessage.message),
    };

    return request(options);
  },
  createReplyMessageContents: (messageParam) => {
    let content;

    switch (messageParam.type) {
      case 'text':
            if(messageParam.text=='訂餐')
            {
        content = [{
          type: 'text',
          text: '您好,訂購午餐請在每天早上09:10以前,連結下面的表單,填寫後送出. %0D%0A https://goo.gl/forms/caOgRQRvFQrB8NyH2',
        }];
        break;
            }
            if(messageParam.text=='菜單')
            {
        content = [{
          type: 'text',
          text: '您好,今日午餐投票結果是:A餐',
        }];
        break;
            }
            if(messageParam.text=='投票')
            {
            //var link = "https://goo.gl/forms/2TsrttkptVKCvn0w";  
    //link += encodeURIComponent(document.getElementById("msg").value) + "%0D%0A" + encodeURIComponent(document.getElementById("url").value);
        content = [{
          type: 'text',
          text: '您好,午餐投票請連結下面的表單,填寫後送出. %0D%0A https://goo.gl/forms/2TsrttkptVKCvn0w1',
        }];
        break;
            }
             
            if(messageParam.text=='help')
            {
        content = [{
          type: 'text',
          text: '您好,訂購午餐,請LINE傳訊息"訂餐".  %0D%0A    午餐投票,請LINE傳訊息"投票".  %0D%0A     查詢菜單請LINE傳訊息"菜單".',
        }];
        break;
            }
      case 'image':
/*
            content = [{
          type: 'text',
          text: '好圖',
        }];

        // /*
        //    1. Only use HTTPS and JPEG
        //    2. Max 1000 characters
        //    3. originalContentUrl ( 1024 x 1024, 1 MB )
        //    4. previewImageUrl ( 240 x 240, 1 MB )
        // */
        // content = [{
        //   type: 'image',
        //   originalContentUrl: '',
        //   previewImageUrl: '',
        // }];
*/
        break;
      case 'video':
/*
            content = [{
          type: 'text',
          text: '好影片',
        }];

        // /*
        //    1. Only use HTTPS
        //    2. Max 1000 characters
        //    3. originalContentUrl ( Only use mp4 and Less than 1 minute, 10 MB )
        //    4. previewImageUrl ( Only use JPEG and 240 x 240, 1 MB )
        // */
        // content = [{
        //   type: 'video',
        //   originalContentUrl: '',
        //   previewImageUrl: '',
        // }];
*/
        break;
      case 'audio':
/*
            content = [{
          type: 'text',
          text: '是聲音',
        }];

        // /*
        //    1. Only use HTTPS
        //    2. Max 1000 characters
        //    3. originalContentUrl ( Only use m4a and Less than 1 minute, 10 MB )
        //    4. duration ( Number, Length of audio file (milliseconds) )
        // */
        // content = {
        //   type: 'audio',
        //   originalContentUrl: '',
        //   duration: 0,
        // };
*/
        break;
      case 'location':
/*
        content = [{
          type: 'text',
          text: '是位置',
        }];

        // /*
        //    1. title ( Max 100 characters )
        //    2. address ( Max 100 characters )
        //    3. latitude ( Decimal )
        //    4. longitude ( Decimal )
        // */
        // content = [{
        //   type: 'location',
        //   title: '',
        //   address: '',
        //   latitude: 0.0,
        //   longitude: 0.0,
        // }]
*/
        break;
      case 'sticker':
/*
        content = [{
          type: 'text',
          text: '好貼圖',
        }];
*/
        // content = [{
        //   type: 'sticker',
        //   packageId: '',
        //   stickerId: '',
        // }]

        break;
      // case 'imagemap':

      //   break;
      // case 'template':

      //   break;
      default:
        content = [];
    }
    return content;
  },
};

const lineRequest = (auth, type, id) => {
  let uri = 'https://api.line.me/v2/bot';

  switch (type) {
    case 'reply':
      uri += '/message/reply'
      break;
    case 'push':
      uri += '/message/push';
      break;
    case 'multicast':
      uri += '/message/multicast';
      break;
    case 'content':
      uri += `/message/${id}/content`;
      break;
    case 'profile':
      uri += `/profile/${id}`;
      break;
    case 'leaveGroup':
      uri += `/group/${id}/leave`;
      break;
    case 'leaveRoom':
      uri += `/room/${id}/leave`;
      break;
  }

  return {
    method: 'POST',
    uri: uri,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.token}`,
    },
    json: true,
  };
};
