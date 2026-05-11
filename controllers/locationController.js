const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getNearbyPharmacies = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(new AppError('بيانات الطلب مفقودة. تأكد من إرسال JSON وتعيين Content-Type.', 400));
    }
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return next(new AppError('من فضلك أدخل خطوط الطول والعرض (lat & lng)', 400));
    }


    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        location: { lat, lng }
      });
    }





    const mockData = {
      userAddress: '123 Street, Cairo, Egypt',
      nearbyPharmacies: [
        {
          name: 'El-Ezaby Pharmacy',
          address: 'Down Street, Mall A',
          distance: '500m'
        },
        {
          name: 'Seif Pharmacy',
          address: 'Main Road, Block 5',
          distance: '1.2km'
        },
        {
          name: '19011 Pharmacy',
          address: 'Corner Street, Building 12',
          distance: '1.8km'
        }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: mockData
    });
  } catch (err) {
    next(err);
  }
};
