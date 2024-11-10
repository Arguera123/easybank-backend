import Schema from './Schema.js';
import Model from './Model.js';
import crypto from 'crypto';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: () => '',
  },
  salt: {
    type: String,
  },
  hashedPassword: {
    type: String,
    required: false,
  },
}, { timestamps: true });

userSchema.methods = {
  encryptPassword: function(password) {
    if (!this.password) return '';
    try {
      const _password = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        'sha512'
      ).toString('hex');
      return _password;
    } catch (error) {
      return '';
    }
  },
  makeSalt: function() {
    return crypto.randomBytes(16).toString('hex');
  },
  comparedPassword: function(password) {
    return this.hashedPassword === this.encryptPassword(password);
  }
}

userSchema
  .virtual('password')
  .set(function(password = crypto.randomBytes(16).toString('hex')) {
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  });

const User = new Model(
  'User', 
  userSchema
);

export default User;
