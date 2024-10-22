import ErrorHandler from "../utils/errorHandler";
import {Request, Response, NextFunction} from 'express';
interface CustomError extends Error {
    path?: string;
    statusCode?: number;
    code?: number;
    keyValue?: any;
}

export default (err : CustomError, req : Request, res : Response, next : NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Sever Error";

    //Handling wrong mongoDB ID error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }
    //Wrong JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Json Web Token is invalid, try again';
        err = new ErrorHandler(message, 400);
    }

    //JWT expire error
    if (err.name === 'TokenExpiredError') {
        const message = 'Json Web Token is expired.';
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode!).json({
        success: false,
        msg: err.message
    })
}