import mongoose, { Schema } from "mongoose";


export interface IWishlist extends Document{
    user:mongoose.Types.ObjectId;
    products:mongoose.Types.ObjectId[];
}


const wishListSchema = new Schema <IWishlist>({
    user:{type:Schema.Types.ObjectId , ref:"user" , required:true},
    products:[{type:Schema.Types.ObjectId , ref:"product"}]
} , {timestamps:true});

export default mongoose.model<IWishlist>("wishlist" , wishListSchema);