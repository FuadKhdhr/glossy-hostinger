const express = require('express');
const router = express.Router();
const User = require('../models/user');

const { Notification } = require('../models/notification');

router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({});
    res.status(200).send({
      message: 'notifications fetched successfully',
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error applying doctor account',
      success: false,
      error,
    });
  }
});

router.post(`/`, async (req, res) => {
  let notification = new Notification({
    title: req.body.title,
    description: req.body.description,
  });
  notification = await notification.save();

  if (!notification)
    return res.status(400).send('the notification cannot be created!');

  res.status(200).send(notification);
});

router.put(`/:id`, async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
    },
    { new: true }
  );

  if (!notification)
    return res.status(400).send('the notification cannot be created!');

  res.send(notification);
});

router.delete('/:id', (req, res) => {
  Notification.findByIdAndRemove(req.params.id)
    .then((notification) => {
      if (notification) {
        return res
          .status(200)
          .json({ success: true, message: 'the notification is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'notification not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
