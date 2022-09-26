import express  from "express";
const router = express.Router();

router.post('/api/users/siginout',(req,res)=>{
    res.send('Hi there')
})

export {router as signoutRouter}