import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
    if(!process.env.JWT_KEY)
    {
        throw new Error('JWT not be definded')
    }
    try
    {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connected to mongodb')
    }
    catch(error)
    {   
        console.log(error)
    }
    app.listen(3000,()=>{
        console.log('Listening on port 3000!')
    })
}
start();