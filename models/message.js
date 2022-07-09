const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const MessageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100
    },
    content: {
      type: String,
      required: true,
      maxLength: 1024
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    }
  }
);

MessageSchema.virtual('timestamp_formatted').get(function() {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model('Message', MessageSchema);
