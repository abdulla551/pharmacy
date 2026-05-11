const Notification = require('../models/notificationModel');

exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .populate('user', 'name')
      .populate('pharmacy', 'name')
      .populate('prescription', 'prescription_image');

    res.status(200).json({
      status: 'success',
      results: notifications.length,
      data: {
        notifications
      }
    });
  } catch (err) {
    next(err);
  }
};
