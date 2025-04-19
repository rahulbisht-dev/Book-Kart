import mongoose, { connect } from "mongoose";


const connectDB = async() :Promise<void> =>{

    console.log("MONGODB URL = " , process.env.URL);
    
    try{
        const connection = await mongoose.connect(process.env.URL as string)
        console.log("database connected successfully")
    }
    catch(error){
        console.log(error);
    }
}

export default connectDB;