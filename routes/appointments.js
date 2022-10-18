const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Doctor = require('../models/doctors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const authMiddleware = require('../helpers/authMiddleware');
const { Appointment } = require('../models/appointment');
const {CancelAppointment} = require('../models/cancelAppointment');
const moment = require('moment');

router.post('/get-appointments-by-user-id', async (req, res) => {
  try {
    //  const doctor = await Doctor.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({
      userId: req.body.userId,
    }).populate('doctorId');
    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching appointments',
      success: false,
      error,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    //  const doctor = await Doctor.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({
      doctorId: req.body.doctorId,
      date: req.body.dateSlot,
    }).populate('doctorId');
    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching appointments',
      success: false,
      error,
    });
  }
});

router.get(`/`, async (req, res) => {
  const appointments = await Appointment.find();

  if (!appointments) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(appointments);
});

router.get(`/get-cancelledAppointments-by-doctor-id`, async (req, res) => {
  const appointments = await CancelAppointment.find();

  if (!appointments) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(appointments);
});

router.get(`/get-pastAppointments`, async (req, res) => {
  const appointments = await Appointment.find().populate({
    path: 'doctorId',
    populate: 'name',
  });

  if (!appointments) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(appointments);
});

router.get('/get-appointments-by-doctor-id', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({ doctorId: doctor._id });
    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching appointments',
      success: false,
      error,
    });
  }
});

router.delete('/:id/cancelled', (req, res) => {
  CancelAppointment.findByIdAndRemove(req.params.id)
    .then((appointments) => {
      if (appointments) {
        return res
          .status(200)
          .json({ success: true, message: 'Appointments is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Appointments not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.delete('/:id', (req, res) => {
  Appointment.findByIdAndRemove(req.params.id)
    .then((appointments) => {
      if (appointments) {
        return res
          .status(200)
          .json({ success: true, message: 'Appointments is cancelled!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Appointments not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.post('/appoint', async (req, res) => {
  let appointmentData = new Appointment({
    userId: req.body.userId,
    doctorId: req.body.doctorId,
    patientInfo: req.body.patientInfo,
    time: req.body.slot,
    date: req.body.selectDate,
  });

  appointmentData = await appointmentData.save();
  if (!appointmentData)
    return res.status(404).send('the appointment can not be created');

  res.status(200).send(appointmentData);
});

router.post(`/canceledAppointment`, async (req, res) => {
  let appointmentData = new CancelAppointment({
    userId: req.body.userId,
    doctorId: req.body.doctorId,
    patientInfo: req.body.patientInfo,
    time: req.body.slot,
    date: req.body.selectDate,
    status: req.body.status,
  });

  appointmentData = await appointmentData.save();
  if (!appointmentData)
    return res.status(404).send('the appointment can not be created');

  res.status(200).send(appointmentData);
});

router.put(`/:id`, async (req, res) => {
  const appointments = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!appointments)
    return res.status(400).send('the appointment cannot be updated!');

  res.status(200).send(appointments);
});

// router.get(`/count`, async (req, res) => {
//   const appointments = await Appointment.countDocuments({
//     doctorId: req.body.doctorId,
//   });

//   if (!appointments) {
//     res.status(500).json({ success: false });
//   }
//   res.status(200).send({
//     data: appointments,
//   });
// });

router.post('/count', async (req, res) => {
  try {
    const appointments = await Appointment.countDocuments({
      doctorId: req.body.doctorId,
    });
    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error fetching appointments',
      success: false,
      error,
    });
  }
});

module.exports = router;
