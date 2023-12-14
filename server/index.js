import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'
dotenv.config();

mongoose.connect(process.env.Mongo).then(() =>{
    console.log("DB connected");
}).catch((error) =>{
    console.log(error);
});

const app = express();
const port = 8080;

app.use(express.json())
app.listen(port, () =>{
    console.log(`server running on port http://localhost:${port}`);
})

app.use('/server/user', userRouter);
app.use('/server/auth', authRouter);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})
