
import ErrorHandler from '../utils/errorHandler';
import Expense from '../models/expenseModel';
import { Expense as TypeExpense, ExpensePerUser, PercentSplits } from '../interface/interface';
import { NextFunction, Request, Response } from 'express';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import Crypto from 'crypto';
import { createObjectCsvWriter } from 'csv-writer';

export const createExpense = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, splits, purpose } = req.body;
        const { user }: any = req;
        let netExpensePerUser: ExpensePerUser[] = [];
        const uniqueSplitId = Crypto.randomBytes(16).toString('hex');
        if (type.toLowerCase() === "equal") {
            //logic for equal split
            const totalAmount = splits.amount;
            if (!splits.amount) {
                return next(new ErrorHandler('Amount is required for Equal Split', 400));
            }
            const totalUsers = splits.users.length;
            const amountPerUser = totalAmount / totalUsers;
            splits.users.forEach((user: string) => {
                netExpensePerUser.push({ _id: user, amount: amountPerUser });
            });

        } else if (type.toLowerCase() === "exact") {
            //logic for exact split
            netExpensePerUser = splits.users;
        }
        else if (type.toLowerCase() === "percentage") {
            //logic for percentage split
            const totalAmount = splits.amount;
            if (!splits.amount) {
                return next(new ErrorHandler('Amount is required for Percentage Split', 400));
            }
            let sumPercentage = 0;
            splits.users.forEach((user: PercentSplits) => {
                sumPercentage += user.percentage;
                netExpensePerUser.push({ _id: user._id, amount: (totalAmount * user.percentage) / 100 });
            });
            if (sumPercentage <= 99.5 || sumPercentage > 100) {
                return next(new ErrorHandler('Percentage should be equal to 100', 400));
            }
        } else {
            return next(new ErrorHandler('Invalid Split Type', 400));
        }

        //bulk write for large data
        await Expense.bulkWrite(netExpensePerUser.map((expense) => ({
            insertOne: {
                document: {
                    purpose,
                    amount: expense.amount,
                    user: expense._id,
                    splittedBy: user._id,
                    splitId: uniqueSplitId
                }
            }
        })));

        res.status(201).json({ success: true, message: 'Expense Splitted successfully' });

    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        } else {
            return next(new ErrorHandler('An unknown error occurred', 500));
        }
    }
});

export const getExpensesByUserId = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const expenses = await Expense.find({ user: id });
        res.status(200).json({ success: true, expenses });
    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        } else {
            return next(new ErrorHandler('An unknown error occurred', 500));
        }
    }
});

export const getAllExpenses = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json({ success: true, expenses });
    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        } else {
            return next(new ErrorHandler('An unknown error occurred', 500));
        }
    }
});

export const downloadBalanceSheetById = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const expenses: any = await Expense.find({ user: id }).populate({ path: 'user', select: 'name email' });
        const records = expenses.map((expense: TypeExpense) => ({
            User: expense.user?.name || 'Unknown',
            Email: expense.user?.email || 'Unknown',
            Description: expense.purpose || 'Unknown',
            Amount: expense.amount,
            Date: expense.date.toISOString()
        }));

        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            header: [
                { id: 'User', title: 'User' },
                { id: 'Email', title: 'Email' },
                { id: 'Description', title: 'Description' },
                { id: 'Amount', title: 'Amount' },
                { id: 'Date', title: 'Date' }
            ],
            path: 'balance_sheet.csv'
        });
        await csvWriter.writeRecords(records);
        res.download('balance_sheet.csv', 'balance_sheet.csv');
    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        } else {
            return next(new ErrorHandler('An unknown error occurred', 500));
        }
    }
});




export const downloadBalanceSheetAll = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expenses: any = await Expense.find().populate({ path: 'user', select: 'name email' });
        const records = expenses.map((expense: TypeExpense) => ({
            User: expense.user?.name || 'Unknown',
            Email: expense.user?.email || 'Unknown',
            Description: expense.purpose || 'Unknown',
            Amount: expense.amount,
            Date: expense.date.toISOString()
        }));

        // Create CSV writer
        const csvWriter = createObjectCsvWriter({
            header: [
                { id: 'User', title: 'User' },
                { id: 'Email', title: 'Email' },
                { id: 'Description', title: 'Description' },
                { id: 'Amount', title: 'Amount' },
                { id: 'Date', title: 'Date' }
            ],
            path: 'balance_sheet.csv'
        });
        await csvWriter.writeRecords(records);
        res.download('balance_sheet.csv', 'balance_sheet.csv');
    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorHandler(error.message, 500));
        } else {
            return next(new ErrorHandler('An unknown error occurred', 500));
        }
    }
});