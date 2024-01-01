
const router = require("express").Router();
const conn = require("../../db/dbconnection");
const admin = require("../../middleware/admin");
const authorized = require("../../middleware/authorize");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper


  
    //show the history of search BY ID of the user
  router.get("/:idfuser", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const his = await query("select * from history where idfuser = ?", [
      req.params.idfuser,
    ]);
    if (!his[0]) {
     return  res.status(404).json({ ms: "his not found !" });
    }
    res.status(200).json(his);
  });
  

   

    module.exports = router;