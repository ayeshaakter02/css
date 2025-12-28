const { default: mongoose } = require("mongoose");

const dbConnection = ()=>{
     mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fvc3cgi.mongodb.net/${process.env.DB_USERNAME}?appName=Cluster0`).then(()=>{
        console.log("Database connect successfull")
    }).catch((err)=>{
        console.log(err.message || "database connection failed")
    })
}



module.exports = dbConnection;