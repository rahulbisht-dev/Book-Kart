import jwt from "jsonwebtoken";
import  { IUser } from "../models/User";

export const generateToken = (user:IUser) :string =>{
    return jwt.sign({userid:user?._id} , process.env.JWT_SECRET_KEY as string, {expiresIn:'2d'})
}