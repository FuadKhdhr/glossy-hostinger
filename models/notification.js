const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
  },
});

// Changing or create a new id instead _id
notificationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
notificationSchema.set('toJSON', {
  virtuals: true,
});

exports.Notification = mongoose.model('Notification', notificationSchema);
