import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import ErrorHandler from '../utils/errorHandler';
import bcrpyt from 'bcrypt';
import { User as TypeUser } from '../interface/interface';

export const getAllUsers = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        } else {
            return next(new ErrorHandler('An unknown error occurred', 500));
        }
    }
});

export const registerUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, phoneNo } = req.body;
        const encyptedPassword = await bcrpyt.hash(password, 10);
        let user = await User.findOne({ email }) as any;
        if (user) {
            return next(new ErrorHandler('User already exists with this email', 400));
        }

        user = await User.create({ name, email, password: encyptedPassword, phone: phoneNo });
        const token = user.getJwtToken();
        res.status(201).json({ success: true, token, user });
    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        } else {
            return next(new ErrorHandler('An unknown error occurred', 500));
        }
    }
});

export const loginUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler('Please enter email & password', 400));
        }
        const user = await User.findOne({ email }).select('+password') as TypeUser;
        if (!user) {
            return next(new ErrorHandler('Invalid Email or Password', 401));
        }
        const isPasswordMatched = await bcrpyt.compare(password, user.password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid Email or Password', 401));
        }
        const token = user.getJwtToken();
        res.json({
            success: true,
            token
        });
    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        } else {
            return next(new ErrorHandler('An unknown error occurred', 500));
        }
    }
});