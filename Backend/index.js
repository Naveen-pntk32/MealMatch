const express  = require("express");
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongodb')
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*",  // allow your frontend
  credentials: true                // if sending cookies or auth headers
}));
connectDB();
const regRoute = require('./routes/auth/register');
const loginRoute = require('./routes/auth/login');
const getCook = require('./routes/getNearbyCook/route');
const verifyToken = require("./routes/middleware/middleware");
app.use("/api/register",regRoute);
app.use("/api/login" , loginRoute);
app.use("/api/nearByCook",getCook);


app.listen(process.env.PORT,()=>{
    console.log(`running on localhost:${process.env.PORT}`);
})