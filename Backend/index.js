require('dotenv').config()
const express = require("express")
const dbConnection = require("./src/config/dbconfig")
const router = require("./src/route")
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());
app.use("/uploads", express.static("uploads"))

// database connection
dbConnection()

// router middleware 
app.use(router)

app.listen(port,()=>{
    console.log(`server is running port number ${port}`)
})