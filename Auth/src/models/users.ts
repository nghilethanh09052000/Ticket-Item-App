import mongoose from "mongoose";
import {Password} from '../services/password'

/** 
    An interface that describes the properties
    that are required to create a new User
**/
interface UserAttrs  {
    email:string ;
    password:string
}

/** 
    An interface that describes the properties
    that a User Model has
**/
interface UserModel extends mongoose.Model<any> { 
    build(attrs:UserAttrs): UserDocument;
}

/** 
    An interface that describes the properties
    that a User Document has
**/
interface UserDocument extends mongoose.Document {
    email:string;
    password:string;
    // createAt:string,
    // updatedAt:string
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save',async function(done) {
    if(this.isModified('password'))
    {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password',hashed);
    }
    done();
})

userSchema.statics.build = (attrs:UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDocument,UserModel>('User',userSchema)




export { User }