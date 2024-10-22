import { Request } from 'express';
export interface User{
    _id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    getJwtToken: () => string;
    _v : number;
}
export interface ExpensePerUser {
    _id: string;
    amount: number;
}
export interface PercentSplits {
    _id: string;
    percentage: number;
}

export interface Expense {
    _id: string;
    purpose: string;
    amount: number;
    date: Date;
    splittedBy: string;
    user: User;
    splitId: string;
    _v: number;
}
