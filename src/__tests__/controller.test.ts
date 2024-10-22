import request from 'supertest';
import app from '../index'; // Assuming your Express app is exported from app.ts
import Expense from '../models/expenseModel';
import ErrorHandler from '../utils/errorHandler';
import mongoose from 'mongoose';

// Mock Expense model
jest.mock('../../src/models/expenseModel', () => ({
    ...jest.requireActual('../../src/models/expenseModel'),
    find: jest.fn()
}));

describe("Controller Tests", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        mongoose.connection.close();
        
    });

    describe("GET /api/user/", () => {
        it("should get all the users", async () => {
            const response = await request(app).get('/api/user/');
            console.log(response, 34);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe("GET /api/expense/", () => {
        it("should get all the expenses", async () => {
            const mockExpenses = [
                { user: "user1", amount: 50, purpose: "Lunch", date: new Date() }
            ];

            (Expense.find as jest.Mock).mockResolvedValue(mockExpenses);

            const response = await request(app).get('/api/expense/');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.expenses.length).toBeGreaterThan(0);
        });
    });
    describe("GET /api/expense/:id", () => {
        it("should get expenses by user ID", async () => {
            const mockExpenses = [
                { user: "user1", amount: 50, purpose: "Lunch", date: new Date() }
            ];

            (Expense.find as jest.Mock).mockResolvedValue(mockExpenses);

            const response = await request(app).get('/api/expense/user1');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.expenses.length).toBeGreaterThan(0);
        });
    });

    describe("Error Handling", () => {
        it("should handle errors properly", async () => {
            (Expense.find as jest.Mock).mockRejectedValue(new ErrorHandler("Something went wrong", 500));

            const response = await request(app).get('/api/expense/user1');

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe("Something went wrong");
        });
    });
});
