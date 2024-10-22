import User from "../models/userModel";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncErrors from "./catchAsyncErrors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Response } from "express";

export const isAuthenticated = catchAsyncErrors(async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization.split(" ")[1];
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    req.user = await User.findById(decodedData.id);
    next();
});
