import mongoose from "mongoose";

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    purpose: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    splittedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    splitId : {
        type : String,
        required : true
    }
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;