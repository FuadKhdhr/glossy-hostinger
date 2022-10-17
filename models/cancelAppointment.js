const mongoose = require('mongoose');

const cancelAppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
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
    },
  },
  {
    timestamps: true,
  }
);

cancelAppointmentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

cancelAppointmentSchema.set('toJSON', {
  virtuals: true,
});

exports.CancelAppointment = mongoose.model(
  'CancelAppointment',
  cancelAppointmentSchema
);
