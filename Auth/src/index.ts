import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
    console.log('Nghi')
    if(!process.env.JWT_KEY)
    {
        throw new Error('JWT not be definded')
    }
    if(!process.env.MONGO_URI) 
    {
      throw new Error('MONGO_URL must be defined');
    }
    try
    {
        await mongoose.connect(process.env.MONGO_URI);
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