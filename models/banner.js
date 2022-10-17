const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

// Changing or create a new id instead _id
bannerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
bannerSchema.set('toJSON', {
  virtuals: true,
});

exports.Banner = mongoose.model('Banner', bannerSchema);
