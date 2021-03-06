const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  phone: String,
  username: {
    type: String,
    unique: true,
    required: 'Email is required', 
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  password: {
    type: String,
    // Custom validation property - array[function, errormsg]
    validate: [(password) => {
      return password && password.length > 6;
    }, 'Password should be longer']
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  admin: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// Virtual attribute for fullName
UserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
  const splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});

// Virtual attribute for admin
UserSchema.virtual('isAdmin').get(function() {
  return this.admin;
});

// Pre-save middleware to handle hashing of user passwords
UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

// Static method to find available unique username for new users
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var possibleUsername = username + (suffix || '');
  this.findOne({
    username: possibleUsername
  }, (err, user) => {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

// Instance method, hashes password string with crypto mod
UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
};

// Instance function to authenticate user password
// Call from User model instance as user.authenticate('password');
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

// Include getters when converting document to JSON
UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

// Use Schema instance to define User model
mongoose.model('User', UserSchema);
