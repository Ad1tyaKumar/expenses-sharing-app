import express from 'express';
import connDB from './config/database';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute';
import expenseRoute from './routes/expenseRoute';
import errorMiddleware from "./middlewares/error";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const startServer = async () => {
    const PORT = process.env.PORT || 5000;
    process.on("uncaughtException", (err) => {
        console.log("Uncaught Exception: ", err);
        process.exit(1);
    });
    connDB();
    app.use("/api/user", userRoute);
    app.use("/api/expense", expenseRoute);
    app.use(errorMiddleware);

    app.listen(PORT, () => {
        if (process.env.__DEV__) {
            console.log('RUNNING IN DEV MODE');
        } else {
            console.log('RUNNING IN PRODUCTION');
        }
        console.log(`Server started on port ${PORT}`);
    });

};

startServer();

export default app;
