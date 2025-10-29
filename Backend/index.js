const express  = require("express");
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongodb')
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5000", 
  credentials: true
}));
connectDB();
const regRoute = require('./routes/auth/register');
const loginRoute = require('./routes/auth/login');
const getCook = require('./routes/getNearbyCook/route');
const verifyToken = require("./routes/middleware/middleware");
const addfood = require("./routes/addfood/route");
const subscriptionRoute = require('./routes/sbuscribe/route');
const getcook = require("./routes/getCooks/getCooks")
const adminRoute = require("./routes/adminlogin/adminLogin");
const getstudents = require("./routes/adminRoutes/getstudents/route");
const admingetCook = require("./routes/adminRoutes/getcooks/route");
const suspendUserRoute = require("./routes/adminRoutes/suspenduser/route");


app.use("/api/register",regRoute);
app.use("/api/login" , loginRoute);
app.use("/api/nearByCook",getCook);
app.use("/api/addfood",addfood);
app.use("/api/subscribe",subscriptionRoute);
app.use("/api/getcook",getcook)
app.use("/api/adminroute",adminRoute)
app.use("/api/adminroute/getcook",admingetCook);
app.use("/api/adminroute/getstudent",getstudents);
app.use("/api/adminroute/suspenduser",suspendUserRoute);

app.listen(process.env.PORT,()=>{
    console.log(`running on localhost:${process.env.PORT}`);
})