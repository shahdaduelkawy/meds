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

//ADD user
router.post(
    "",
    body("id_user")
      .isInt()
      .withMessage("please enter a valid user id")
      .isLength({ min: 1 })
      .withMessage("user should be at lease 1 characters"),
  
      body("phone_user")
      .isInt()
      .withMessage("please enter a valid user phone")
      .isLength({ min: 1 })
      .withMessage(" user phone should be at lease 1 characters"),
  
      body("name_user")
      .isString()
      .withMessage("please enter a valid user name")
      .isLength({ min: 1 })
      .withMessage("user name should be at lease 1 characters"),
  
      body("email")
      .isEmail()
      .withMessage("please enter a valid user email")
      .isLength({ min: 1 })
      .withMessage("user email should be at lease 1 characters"),
      //0 --> in-active 1-->active
      body("status")
      .isBoolean()
      .withMessage("please enter a validstatus"),
     // 0->user 1->admin
      body("type")
      .isBoolean()
      .withMessage("please enter a valid user id"),
  
  
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
       
        // 3- PREPARE user OBJECT
        const user = {
            id_user: req.body.id_user,
            phone_user: req.body.phone_user,
            name_user: req.body.name_user,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 1),
            type: req.body.type,
            status: req.body.status,
            token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
        };
  
        // 4 - INSERT user INTO DB
        const query = util.promisify(conn.query).bind(conn);
        await query("insert into user_model set ? ", user);
        res.status(200).json({
          msg: "user created successfully !",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );

  //UPDATE user
  router.put(
    "/:id_user", // params
    
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF user EXISTS OR NOT
        const user = await query("select * from user_model where id_user = ?", [
          req.params.id_user,
        ]);
        if (!user[0]) {
          res.status(404).json({ ms: "user not found !" });
        }
        // 4- UPDATE user
        await query("update user_model set type = ? where id_user = ?", [req.body.type, user[0].id_user])
       console.log(req.params.id_user)
        console.log(req.body.type)
       
        res.status(200).json({
          msg: "user updated successfully",
        });

      } catch (err) {
        console.log(req.params.id_user)
        console.log(req.body.type)
       
        res.status(500).json(err);
      }
    }
  );

   //DELETE user
  router.delete(
    "/delete/:id_user", // params
    async (req, res) => {
      try {
        // 1- CHECK IF user EXISTS OR NOT
        const query = util.promisify(conn.query).bind(conn);
        const user = await query("select * from user_model where id_user = ?", [
          req.params.id_user,
        ]);
        if (!user[0]) {
          res.status(404).json({ ms: "user not found !" });
        }
        // 2- REMOVE user 
        await query("DELETE FROM user_model WHERE id_user= ?", [user[0].id_user]);
        res.status(200).json({
          msg: "user delete successfully",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );
   
  // LIST & SEARCH BY THE NAME OF THE user
  router.get("", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
      // QUERY PARAMS
      search = `where id_user LIKE '%${req.query.search}%'`;
    }
    const user_model = await query(`select * from user_model ${search}`);
    user_model.map((user_model) => {
    });
    res.status(200).json(user_model);
  });
    
  
    // FILTER BY type
  router.get("/type/:type", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const user = await query("select * from user_model where type = ?", [
      req.params.type,
    ]);
    if (!user[0]) {
      res.status(404).json({ ms: "user not found !" });
    }
    res.status(200).json(user);
  });
  


   // FILTER BY status
   router.get("/status/:status", 
   async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const user = await query("select * from user_model where status = ?", [
      req.params.status
    ]);
    if (!user[0]) {
      res.status(404).json({ ms: "user not found !" });
    }
    res.status(200).json(user);
  });




module.exports = router;