const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: {
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
  created: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to handle hashing of user passwords
UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

// Instance method, hashes password string with crypto mod
UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
};

// Use Schema instance to define User model
mongoose.model('User', UserSchema);
