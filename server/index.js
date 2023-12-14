import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
dotenv.config();

mongoose.connect(process.env.Mongo).then(() =>{
    console.log("DB connected");
}).catch((error) =>{
    console.log(error);
});
const app = express();
const port = 8080;

app.listen(port, () =>{
    console.log(`server running on port http://localhost:${port}`);
})

app.use('/server/user', userRouter);
// app.get('/test', (req, res)=>{
//     res.json({message: "calling api"});
// })
