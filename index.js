 const express = require ("express");
 const cors = require('cors');
 const app = express();
 
 const hisreq =require('./routes/admin/hisreq');
 const sendres =require('./routes/admin/sendres');
 const adduser =require('./routes/admin/adduser');
 const addcat =require('./routes/admin/addcat');
 const addmed =require('./routes/admin/addmed');

const auth =require('./routes/auth');

const filter =require('./routes/user/filter');
const sendreq =require('./routes/user/sendreq');
const historyofsearch =require('./routes/user/historyofsearch');


 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({extended: true}));



 app.listen(3001 , () => {
    console.log("running the server on port 3001");
 });

 
 app.use("/respo", sendres);
 app.use("/request", sendreq);
 app.use("/auth", auth);
 app.use("/cat", addcat);
 app.use("/med", addmed);
 app.use("/fil", filter);
 app.use("/user", adduser);
 app.use("/histsearch", historyofsearch);
 app.use("/hisreq", hisreq);