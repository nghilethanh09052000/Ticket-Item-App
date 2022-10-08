/** 
    Expreess App
**/
import { body } from "express-validator";
import express,{Request,Response}  from "express";
import jwt from "jsonwebtoken";
/*
    Bad request handler
*/
import { BadRequestError } from "@nghilt/common";
import { ValidateRequest } from "@nghilt/common";
/*
    Models
*/
import { User } from "../models/users";

const router = express.Router();

router.post('/api/users/signup', [
    body('email') 
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min:4,max:20})
        .withMessage("Password must be between 4 and 20 characters")
],
ValidateRequest,
async (req:Request,res:Response)=>{

    
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser)
    {
        throw new BadRequestError('Email in use')
    }
    const user = User.build({email,password})
    await user.save();

    // Generate Json Web Token:
    const userJwt = jwt.sign(
        {
            id:user.id
            ,email:user.email
        },
        process.env.JWT_KEY!
        )
    // Store on session:
    req.session = {
        jwt:userJwt
    };
    res.status(201).send(user)
    
    
})

export {router as signupRouter}