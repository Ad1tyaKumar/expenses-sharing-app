import express from 'express';
import { createExpense, getExpensesByUserId, getAllExpenses, downloadBalanceSheetAll, downloadBalanceSheetById } from '../controllers/expenseController';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

router.get("/", getAllExpenses);
router.get("/:id", getExpensesByUserId);
router.post("/create", isAuthenticated, createExpense);
router.get("/balance-sheet/all", isAuthenticated, downloadBalanceSheetAll);
router.get("/balance-sheet/:id", downloadBalanceSheetById);

export default router;