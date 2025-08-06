// 1.
const express = require('express')
require("dotenv").config()
const app = express()
const fileUpload = require("express-fileupload")
const cookieParser = require("cookie-parser")

// 7. Swagger docs
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml")
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument))

//8. using ejs -> ejs comes as a part of middleware and it uses view engine, hence we will set the view engine as below
app.set('view engine','ejs')

// 5. bring in regular middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// 6.cookies and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}));


// 4.bring in logger -> morgan -> morgan needs to be at the top of all the routes
const morgan = require("morgan")
app.use(morgan("tiny")) //tiny is a package of morgan that gives us logs like this:- GET /api/v1/ 304 - - 4.089 ms



//2. bring all the routes here
const home = require("./routes/home.js");
const user = require("./routes/user.js");
const product = require("./routes/productRoute.js");


//3. write router middlewares here
app.use("/api/v1",home);
app.use("/api/v1",user);
app.use("/api/v1",product);

// 9. testing fileupload

app.get("/signuptest",(req,res)=>{
    res.render("signupForm")
})


module.exports = app