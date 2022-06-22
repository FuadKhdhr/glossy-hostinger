const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
  // image: {
  //   type: String,
  // },
});

// Changing or create a new id instead _id
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});
categorySchema.set('toJSON', {
  virtuals: true,
});

exports.Category = mongoose.model('Category', categorySchema);
