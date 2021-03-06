const User = require('mongoose').model('User');
const passport = require('passport');

function getErrorMessage(err) {
  let message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001: 
        message = 'Email already exists';
        break;
      default: 
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message)
      {
        message = err.errors[errName].message;
      }
    }
  }

  return message;
};

exports.renderSignin = function(req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title: 'Sign In Form',
      messages: req.flash('error').concat(req.flash('info'))
    });
  } else {
    return res.redirect('/');
  }
};

exports.renderSignup = function(req, res, next) {
  if (!req.user) {
    res.render('signup', {
      title: 'Sign Up Form',
      messages: req.flash('error').concat(req.flash('info'))
    });
  } else {
    return res.redirect('/');
  }
};

exports.renderUpdate = function(req, res, next) {
  if (req.user) {
    res.render('updateUser', {
      title: 'Update Profile Form',
      user: req.user,
      messages: req.flash('error').concat(req.flash('info'))
    });
  } else {
    return res.redirect('/');
  }
};

exports.signup = function(req, res, next) {
  if (!req.user) {
    const user = new User(req.body);
    user.provider = 'local';

    user.save((err) => {
      if (err) {
        const message = getErrorMessage(err);
        req.flash('error', message);
        return res.redirect('/signup');
      }
      
      req.login(user, (err) => {
        if (err) { 
          return next(err);
        }
        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
};

exports.updateUser = function(req, res, next) {
  const user = req.user;

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.phone = req.body.phone;
  user.username = req.body.username;
  user.password = req.body.password;
  if (req.body.admin) {
    user.admin = true;
  } else {
    user.admin = false;
  }

  user.save((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      return res.redirect('/');
    }
  });
};

exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// Accepts user profile then looks for existing user with providerId and provider properties
exports.saveOAuthUserProfile = function(req, profile, done) {
  User.findOne({
    provider: profile.provider,
    providerId: profile.providerId
  }, (err, user) => {
    if (err) {
      return done(err);
    } else {
      // If cannot find existing user, find unique username
      if (!user) {
        const possibleUsername = profile.username;

        User.findUniqueUsername(possibleUsername, null, (availableUsername) => {
          const newUser = new User(profile);
          newUser.username = availableUsername;

          newUser.save((err) => {
            return done(err, newUser);
          });
        });
      } else {
        return done(err, user);
      }
    }
  });
};
