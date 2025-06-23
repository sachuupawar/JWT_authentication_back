const User = require('../modals/user_modal');
const ErrorResponse = require('../utils/error_response');

const authController = {
  register: async (req, res, next) => {
    const { name, email, password } = req.body;
    // console.log(req.body)

    try {
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return next(new ErrorResponse('Email already used', 400));
      }

      const user = await User.create({ name, email, password });
      const token = user.getSignedJwtToken();

      console.log(`User registered successfully !`);
      res.status(201).json({
        success: true,
        message: 'Successfully registered',
        token
      });
    } catch (err) {
      console.error(`Registration error: ${err.message}`);
      next(err);
    }
  },

  
  login: async (req, res, next) => {
    const { email, password } = req.body;
    // console.log(req.body)

    try {
      
      if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400));
      }

      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }

      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
      }

      const token = user.getSignedJwtToken();

      console.log(`User logged in successfully !`);
      res.status(200).json({
        success: true,
        message: 'login Successfully ',
        token
      });
    } catch (err) {
      console.error(`Login error: ${err.message}`);
      next(err);
    }
  }
};

module.exports = authController;