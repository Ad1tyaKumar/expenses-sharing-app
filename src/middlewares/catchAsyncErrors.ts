import { Request, Response, NextFunction } from "express";

export default (catchAsyncErrors: (req: Request | any, res: Response,next : NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(catchAsyncErrors(req, res, next)).catch(next);
};
