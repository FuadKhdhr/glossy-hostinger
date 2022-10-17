const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const Doctor = require('../models/doctors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Appointment = require('../models/appointment');
const moment = require('moment');

router.get(`/`, async (req, res) => {
  const userList = await User.find();

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (!user) {
    res
      .status(500)
      .json({ message: 'The user with the given ID was not found.' });
  }
  res.status(200).send(user);
});

router.post('/register', async (req, res) => {
  const userExists = await User.findOne({ phone: req.body.phone });
  if (userExists) {
    return res
      .status(201)
      .send({ message: 'User already exists', success: false });
  }
  let user = new User({
    name: req.body.name,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 10),
    address: req.body.address,
  });
  user = await user.save();

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

router.post('/login', async (req, res) => {
  // const user = await User.findOne({ email: req.body.email });
  const user = await User.findOne({ phone: req.body.phone });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send('The user not found');
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor,
      },
      secret,
      { expiresIn: '1w' }
    );

    res.status(200).send({ user: user.phone, token: token });
  } else {
    res.status(400).send('password is wrong!');
  }
});

router.post(`/booking`, async (req, res) => {
  const bookingDate = await Appointment.find().populate('doctorId');

  if (!bookingDate) {
    res
      .status(500)
      .json({ message: 'The doctor with the given ID was not found.' });
  } else {
    res.status(200).send(bookingDate);
  }
});

router.put('/:id', async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      password: newPassword,
    },
    { new: true }
  );

  if (!user) return res.status(400).send('the user cannot be created!');

  res.status(200).send(user);
});

router.put('/account/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isAdmin: req.body.isAdmin,
      isDoctor: req.body.isDoctor,
    },
    { new: true }
  );

  if (!user) return res.status(400).send('the user cannot be created!');

  res.status(200).send(user);
});

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: 'the user is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'user not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
