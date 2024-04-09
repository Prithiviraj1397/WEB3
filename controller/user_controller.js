const httpStatus = require('http-status');
const User = require('../model/user_model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/sendResponse');
const { generateToken } = require('../middlewares/jwt');

exports.register = catchAsync(async (req, res) => {
    if (await User.isEmailTaken(req.body.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const user_data = await User.create(req.body);
    sendResponse(res, httpStatus.CREATED, true, 'User Register Successfully', user_data)
});

exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Email or Password');
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Email or Password');
    }
    const token = generateToken(user)
    res.send({ status: true, message: 'User Login Successfully', token })
});

exports.get_single_user = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId")
    }
    res.send({ status: true, message: 'User Details', user })
})


exports.delete_single_user = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const user = await User.deleteOne({ _id: userId });
    if (!user.deletedCount) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send({ status: true, message: 'User Delete Successfully' })
})