const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/doctors');
const authMiddleware = require('../helpers/authMiddleware');
const Appointment = require('../models/appointment');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { categories: req.query.categories.split(',') };
  }

  const doctorList = await Doctor.find(filter).populate('specialization');

  if (!doctorList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(doctorList);
});

router.get('/:id', async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res
      .status(500)
      .json({ message: 'The doctor with the given ID was not found.' });
  }
  res.status(200).send(doctor);
});

router.get('/get-doctor-info', async (req, res) => {
  try {
    const doctor = await Doctor.find();
    res.status(200).send({
      success: true,
      message: 'Doctor info fetched successfully',
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error getting doctor info', success: false, error });
  }
});

// router.post('/getdoctor', async (req, res) => {
//   try {
   
//     const doctor = await Doctor.find({ userId: req.body.userId, }).populate('userId');;
//     res.status(200).send({
//       message: 'doctor fetched successfully',
//       success: true,
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: 'Error fetching doctor',
//       success: false,
//       error,
//     });
//   }
// });


router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  const specialization = await Category.findById(req.body.specialization);
  if (!specialization) return res.status(400).send('Invalid specialization');

  const file = req.file;
  if (!file) return res.status(400).send('No image in the request');

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  let doctor = new Doctor({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    // password: bcrypt.hashSync(req.body.password, 10),
    description: req.body.description,
    specialization: req.body.specialization,
    image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
    // timings: [req.body.timings],
    startTime: req.body.startTime,
    toTime: req.body.toTime,
  });

  doctor = await doctor.save();

  if (!doctor) return res.status(500).send('The doctor cannot be created');

  res.status(200).send(doctor);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }
  const category = await Category.findById(req.body.specialization);
  if (!category) return res.status(400).send('Invalid specialization');

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(400).send('Invalid Doctor!');

  const file = req.file;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = doctor.image;
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      // specializationID: req.body.specializationID,
      description: req.body.description,
      specialization: req.body.specialization,
      image: imagepath,
      startTime: req.body.startTime,
      toTime: req.body.toTime,
    },
    { new: true }
  );

  if (!updatedDoctor)
    return res.status(500).send('the product cannot be updated!');

  res.status(200).send(updatedDoctor);
});

router.put('/doctorid/:phone', async (req, res) => {
  const doctor = await Doctor.findOneAndUpdate(
    { phone: req.body.phone },
    { $set: { userId: req.body.userId } },
    { new: true }
  );

  if (!doctor) return res.status(400).send('the userId cannot be created!');

  res.status(200).send(doctor);
});

router.delete('/:id', (req, res) => {
  Doctor.findByIdAndRemove(req.params.id)
    .then((doctor) => {
      if (doctor) {
        return res.status(200).json({
          success: true,
          message: 'Doctor is deleted!',
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Doctor not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.post('/get-doctor-info-by-user-id', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: 'Doctor info fetched successfully',
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error getting doctor info', success: false, error });
  }
});

router.get('/get-appointments-by-doctor-id', async (req, res) => {
  try {
    // const doctor = await Doctor.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({
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
