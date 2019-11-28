const nodemailer = require('nodemailer');
require('dotenv').config();
exports.sendEmail = (data,result)=>{

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_KEY
        },
        tls: {
            rejectUnauthorized: false
        }
      });
      
      var mailOptions = {
        from: 'rjt1447@gmail.com',
        to: data.email,
        subject: data.subject,
        html: data.html
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          result(null, info.response);
        }
      });

}

