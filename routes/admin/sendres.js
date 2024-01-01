const router = require("express").Router();
const conn = require("../../db/dbconnection");
const admin = require("../../middleware/admin");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const bind = require("bind");
const promisify = require("promisify");
const params = require("params");



 //UPDATE user
 router.put(
    "/:idfreq", // params
    
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF response EXISTS OR NOT
        const response = await query("select * from req_model where idfreq = ?", [
          req.params.idfreq,
        ]);
        if (!response[0]) {
          res.status(404).json({ ms: "response not found !" });
        }
        
        // 4- UPDATE response
        await query("update req_model set statut_req = ? where idfreq = ?", [req.body.statut_req, response[0].idfreq])
       console.log(req.params.idfreq)
        console.log(req.body.statut_req)
       
        res.status(200).json({
          msg: "response updated successfully",
        });

      } catch (err) {
        console.log(req.params.idfreq)
        console.log(req.body.statut_req)
       
        res.status(500).json(err);
      }
    }
  );

//idfreq, namenewca, namenewmeds, statut_req req_model

// LIST & SEARCH BY THE idfreq OF THE req
router.get("", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
      // QUERY PARAMS
      search = `where idfreq LIKE '%${req.query.search}%'`;
    }
    const req_model = await query(`select * from req_model ${search}`);
    req_model.map((req_model) => {
    });
    res.status(200).json(req_model);
  });
 
  
    
  
module.exports = router;
