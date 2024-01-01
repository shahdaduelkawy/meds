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



//the admin can write the name of the admin that can accept his req
//ADD req
router.post(
    "",
      body("namenewca")
      .isString()
      .withMessage("please enter a valid category name")
      .isLength({ min: 1 })
      .withMessage("user name should be at lease 1 characters"),
  
      body("nameofuser")
      .isString()
      .withMessage("please enter a valid category name")
      .isLength({ min: 1 })
      .withMessage("user name should be at lease 1 characters"),
  
      body("namenewmeds")
      .isString()
      .withMessage("please enter a valid med name")
      .isLength({ min: 1 })
      .withMessage("reqmed name should be at lease 1 characters"),
  
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
  
       // 2- PREPARE req OBJECT
      const request = {
        idfreq: req.body.idfreq,
        nameofuser: req.body.nameofuser,
        namenewca: req.body.namenewca,
        namenewmeds: req.body.namenewmeds,
      };
      // 3 - INSERT request INTO DB
      const query = util.promisify(conn.query).bind(conn);
      await query("insert into req_model set ? ", request);
      res.status(200).json({
        msg: "request created successfully !",
      });
  
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );

     //idfreq, namenewca, namenewmeds, statut_req req_model



 // LIST & SEARCH BY THE statut_req OF THE req
 router.get("", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
      // QUERY PARAMS
      search = `where statut_req LIKE '%${req.query.search}%'`;
    }
    const req_model = await query(`select * from req_model ${search}`);
    req_model.map((req_model) => {
    });
    res.status(200).json(req_model);
  });
    


  
    // FILTER BY namenewca
  router.get("/:namenewca", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const user = await query("select * from req_model where namenewca = ?", [
      req.params.namenewca,
    ]);
    if (!user[0]) {
      res.status(404).json({ ms: "user not found !" });
    }
    res.status(200).json(user);
  });
  

module.exports = router;