const mongoose = require('mongoose');

const MemberSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      maxLength: 50,
    },
    surname: {
      type: String,
      required: true,
      maxLength: 50,
    },
    username: {
      type: String,
      required: true,
      maxLength: 32,
    },
    password: {
      type: String,
      required: true,
    },
    membership_status: {
      type: String,
      required: true,
      enum: ['member', 'admin'],
      default: 'member'
    }
  }
);

MemberSchema.virtual('name').get(function() {
  return `${this.first_name} ${this.surname}`;
});

MemberSchema.virtual('url').get(function() {
  return `/members/${this._id}`;
});

modeule.exports = mongoose.model('Member, MemberSchema');
