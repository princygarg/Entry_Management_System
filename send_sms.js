require('dotenv').config();
const accountSid = process.env.ACC_SID;
const authToken = process.env.AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

exports.sendSMS = (data, result)=>{
    client.messages.create({
        to: '+91' + data.to,
        from: '+12054303968',
        body:  data.body
    })
    .then((message) => console.log(message.sid));
}
