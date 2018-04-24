const config = require('../../config/config');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: config.email_service,
  auth: {
    user: config.email,
    pass: config.email_password
  }
});

/*// var mailOptions = {
//   from: 'youremail@gmail.com',
//   to: 'myfriend@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };*/

/*transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});*/

exports.sendMail = function (mailOption) {
  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};