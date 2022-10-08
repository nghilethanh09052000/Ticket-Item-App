/** 
    Expreess App
**/

import { body, validationResult } from "express-validator";
import express,{Request,Response}  from "express";
import jwt from "jsonwebtoken";
/*

    Bad request handler
*/
import { RequestValidationError} from "@nghilt/common";
import { ValidateRequest } from "@nghilt/common";
import { BadRequestError } from "@nghilt/common";
/*
    Models
*/
import { User } from "../models/users";
import { Password } from "../services/password";

const router = express.Router();

router.post('/api/users/signin', 
[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must provide a password')
],
ValidateRequest,
async (req:Request,res:Response)=>{

    const { email, password } = req.body;

    const existingUser = await User.findOne({email});

    if(!existingUser)
    {
        throw new BadRequestError('Invalid credentials');
    }
    const passwordMatch = await Password.compare(existingUser.password,password);
    if(!passwordMatch)
    {
        throw new BadRequestError('Invalid credentials');
    }
     // Generate Json Web Token:
     const userJwt = jwt.sign(
        {
            id:existingUser.id
            ,email:existingUser.email
        },
        process.env.JWT_KEY!
        )
    // Store on session:
    req.session = {
        jwt:userJwt
    };
    res.status(200).send(existingUser)
})

export {router as signinRouter}