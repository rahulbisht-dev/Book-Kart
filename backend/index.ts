import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import connectDB from "./config/dbConnection";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoute";
import cartRoutes from "./routes/cartRoutes";
import wishListRoutes from "./routes/wishListRoutes";
import addressRoutes from "./routes/addressRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoute";
import passport from "./controllers/strategy/googleStrategy"


dotenv.config();


const PORT = process.env.PORT || 8000;
const app = express();



// Middlewares

app.use(cors({credentials:true , origin:process.env.FRONTEND_URL}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());


// API ENDPOINTS

app.use("/api/auth" , authRoutes);
app.use("/api/product" , productRoutes);
app.use("/api/cart" , cartRoutes);
app.use("/api/wishlist" , wishListRoutes);
app.use("/api/user/address" , addressRoutes);
app.use("/api/user/" , userRoutes);
app.use("/api/order" , orderRoutes);

// Starting Server
connectDB();
app.listen(PORT , ()=>console.log(`server started running on the PORT ${PORT}`));8