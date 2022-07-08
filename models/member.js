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
      enum: ['noob', 'member'],
      default: 'noob'
    },
    admin: {
      type: Boolean,
      default: false
    }
  }
);

MemberSchema.virtual('name').get(function() {
  return `${this.first_name} ${this.surname}`;
});

module.exports = mongoose.model('Member', MemberSchema);
