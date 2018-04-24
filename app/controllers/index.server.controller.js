const nodemail = require('../libs/mail');
const config = require('../../config/config');

var mailOptions = {
  from: config.email,
  to: config.email,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

// Create a new 'render' controller method
exports.render = function (req, res) {
  // Use the 'response' object to render the 'index' view with a 'title' and 'userFullName' properties
  res.render('index', {
    title: 'Welcome to Green Valley Community Park',
    headline: 'Reservation System',
    userFullName: req.user ? req.user.fullName : '',
    test: nodemail.sendMail(mailOptions)
  });
};
