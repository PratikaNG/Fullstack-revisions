const app = require('./app')
const connectWithDB = require('./config/database')
require("dotenv").config()
const {PORT} = process.env
const cloudinary = require("cloudinary").v2


//2. connect with db before the server starts
connectWithDB();

// 3. cloudinary connect
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


app.listen(PORT,()=>{console.log(`Server is running at the port: ${PORT}`)})