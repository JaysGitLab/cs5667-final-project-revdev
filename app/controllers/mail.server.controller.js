const config = require('../../config/config');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: config.email_service,
  auth: {
    user: config.email,
    pass: config.email_password
  }
});


exports.sendMail = function (req, res, next) {
  if(res.eventCreated) {
    console.log('creating email');
    let mailOptions = {
      from: config.email,
      to: config.email,
      // to: req.body.username
      subject: '[GreenValleyPark] Reservation request ' + res.req.res.event.eventType,//'Sending Email using Node.js',
      text: 'User ' + req.body.username + ' requested a ' + res.req.res.event.eventType + ' event from ' + req.body.startTime + ' to ' +
      req.body.endTime + ' on the ' + req.body.areas[0] + '.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        next(error)
      } else {
        console.log('Email sent: ' + info.response);
        next()
      }
    });
  } else {
    console.log('no email will be send');
    next()
  }
};