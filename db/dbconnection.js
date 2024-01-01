const mysql2 = require("mysql2");



const connection  = mysql2.createConnection({ 
    host: "localhost",
    port: "3300",
    user: "root",
    password: "shahd",
    database:"medsdatabase",
 });
 
   connection.connect((err)=>{
    if(err) throw err;
    console.log("DB connected");
   });
   module.exports = connection;
   