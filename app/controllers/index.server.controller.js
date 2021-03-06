// Create a new 'render' controller method
exports.render = function (req, res) {
  // Use the 'response' object to render the 'index' view with a 'title' and 'userFullName' properties
  res.render('index', {
    title: 'Welcome to Green Valley Community Park',
    headline: 'Reservation System',
    userFullName: req.user ? req.user.fullName : '',
    isAdmin: req.user ? req.user.isAdmin : false,
    messages: req.flash('error').concat(req.flash('info'))
  });
};
