const app = require('./app')
const connectWithDB = require('./config/database')
require("dotenv").config()
const {PORT} = process.env

// connect with db before the server starts
connectWithDB();

app.listen(PORT,()=>{console.log(`Server is running at the port: ${PORT}`)})