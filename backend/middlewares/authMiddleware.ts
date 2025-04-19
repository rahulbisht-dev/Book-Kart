import  jwt  from 'jsonwebtoken';
import { NextFunction, Request ,  Response } from "express";
import { response } from '../utils/responseHandler';


declare global {
    namespace Express {
        interface Request{
            id:string;
        }
    }
}

const authenticateUser = async(req:Request , res:Response , next:NextFunction) =>{

    const token = req.cookies.access_token;

    if(!token){
        return response(res , 401 , "User Not authenticated , Please Log-in first.");
    }

    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET_KEY as string) as jwt.JwtPayload;

        if(!decode){
            return response(res , 400 , "Not Authorized User Not Found")
        }
        req.id  = decode.userid;
        next();
    }
    catch(error){
        return response(res , 401 , "Not Authorized , User Not Found..")
    }
}

export  default authenticateUser;


