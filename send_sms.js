const accountSid = 'AC78bc8f82b0389df7ee81790daaf547a3';
const authToken = 'f22378bda320acca61da1156fe715885';

const client = require('twilio')(accountSid, authToken);

exports.sendSMS = (data, result)=>{
    client.messages.create({
        to: '+91' + data.to,
        from: '+12054303968',
        body:  data.body
    })
    .then((message) => console.log(message.sid));
}