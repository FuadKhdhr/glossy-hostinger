const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    userId: {
      type: String,
      required: true,
    },
    // doctorId: {
    //   type: String,
    //   required: true,
    // },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patientInfo: {
      type: Object,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

appointmentSchema.set('toJSON', {
  virtuals: true,
});

exports.Appointment = mongoose.model('Appointment', appointmentSchema);
