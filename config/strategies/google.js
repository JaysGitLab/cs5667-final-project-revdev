const passport = require('passport');
const url = require('url');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config');
const users = require('../../app/controllers/users.server.controller');

module.exports = function() {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    const providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    const providerUserProfile = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      fullName: profile.displayName,
      username: profile.emails[0].value,
      provider: 'google',
      providerId: profile.id,
      providerData: providerData
    };

    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
