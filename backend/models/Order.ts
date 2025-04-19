import mongoose, { Document,  Schema } from "mongoose";
import { IAddress } from "./Address";

export interface IOrderItem extends Document{
    product:mongoose.Types.ObjectId;
    quantity:number;
}


export interface IOrder extends Document{
    _id:mongoose.Types.ObjectId;
    user:mongoose.Types.ObjectId;
    items:IOrderItem[];
    totalAmount:number;
    shippingAddress:mongoose.Types.ObjectId | IAddress;
    status:"processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus:"pending" | "completed";
}

const orderItemsSchema = new Schema<IOrderItem>({
    product:{type:Schema.Types.ObjectId , ref:"product" , required:true},
    quantity:{type:Number , required:true}
})

const orderSchema = new Schema<IOrder>({
    user:{type:Schema.Types.ObjectId , ref:"user" , required:true},
    items:[orderItemsSchema],
    totalAmount:{type:Number},
    shippingAddress:{type:Schema.Types.ObjectId , ref:"address"},
    status:{type:String , enum:["processing" , "shipped" , "delivered" , "cancelled"] , default:null},
    paymentStatus:{type:String , enum:["pending" , "completed"]}
} , {timestamps:true});


export default mongoose.model<IOrder>("order" , orderSchema);