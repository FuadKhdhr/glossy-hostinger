const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      // required: true,
    },
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    startTime: {
      type: String,
      required: true,
    },
    toTime: {
      type: String,
      required: true,
    },

    // timings: {
    //   type: Array,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

doctorSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
doctorSchema.set('toJSON', {
  virtuals: true,
});
// productSchema.method('toJSON', function () {
//   const { __v, ...object } = this.toObject();
//   const { _id: id, ...result } = object;
//   return { ...result, id };
// });

exports.Doctor = mongoose.model('Doctor', doctorSchema);
