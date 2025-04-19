import multer from "multer";
import {v2 as cloudinary, UploadApiOptions, UploadApiResponse} from "cloudinary";
import dotenv from "dotenv"
import { RequestHandler } from "express";
dotenv.config();




cloudinary.config({
    cloud_name:process.env.ClOUDINARY_NAME,
    api_secret:process.env.API_SECRET_KEY,
    api_key:process.env.CLOUDINARY_API_KEY
})


interface customFile extends Express.Multer.File{
    Path:string
}


const uploadToCloudinary = (file:customFile) : Promise<UploadApiResponse> =>{
    const options: UploadApiOptions = {
        resource_type:"image"
    }

    return new Promise((resolve , reject) =>(
        cloudinary.uploader.upload(file.path , options , (error , result) =>{
            if(error){
                return reject(error)
            }

            resolve(result as UploadApiResponse);
           })
    ))
}


const multerMiddleware : RequestHandler = multer({dest:"uploads/"}).array("images" , 4);

export {multerMiddleware , uploadToCloudinary};