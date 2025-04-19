import mongoose, { Document, Schema } from "mongoose";


export interface ICartItem extends Document{
    product:mongoose.Types.ObjectId;
    quantity:number;
}

export interface Icart extends Document{
    user:mongoose.Types.ObjectId;
    items:ICartItem[];
}


const cartItemsSchema = new Schema<ICartItem>({
    product:{type:Schema.Types.ObjectId , ref:'product' , required:true},
    quantity:{type:Number , required:true , min:1},
})


const cartSchema = new Schema <Icart>({
    user:{type:Schema.Types.ObjectId , ref:"user" , required:true},
    items:[cartItemsSchema]

} , {timestamps:true})


export default mongoose.model<Icart>("cart" , cartSchema);