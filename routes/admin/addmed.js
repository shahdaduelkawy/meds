const router = require("express").Router();
const conn = require("../../db/dbconnection");
const admin = require("../../middleware/admin");
//const authorized = require("../middleware/authorize");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const bind = require("bind");
const promisify = require("promisify");
const params = require("params");



//ADD MED
router.post(
    "",
    body("id_med")
      .isInt()
      .withMessage("please enter a valid med id")
      .isLength({ min: 1 })
      .withMessage("med should be at lease 1 characters"),
  
      body("price")
      .isInt()
      .withMessage("please enter a valid med price")
      .isLength({ min: 1 })
      .withMessage(" med price should be at lease 1 characters"),
  
      body("Name_meds")
      .isString()
      .withMessage("please enter a valid med name")
      .isLength({ min: 1 })
      .withMessage("med name should be at lease 1 characters"),
  
      body("description_meds")
      .isString()
      .withMessage("please enter a valid med description")
      .isLength({ min: 1 })
      .withMessage("med description should be at lease 1 characters"),
  
      body("Expiration_date")
      .isDate()
      .withMessage("please enter a valid Expiration date")
      .isLength({ min: 1 })
      .withMessage("movie name should be at lease 1 characters"),
  
      body("userfid")
      .isInt()
      .withMessage("please enter a valid user id")
      .isLength({ min: 1 })
      .withMessage("user id should be at lease 1 characters"),
  
    body("namefcategory")
      .isString()
      .withMessage("please enter a valid name category ")
      .isLength({ min: 2 })
      .withMessage("name category name should be at lease 1 characters"),

    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
       //id_med, price, Name_meds, description_meds, Expiration_date, userfid, namefcategory , medicine_model
  
        // 3- PREPARE MOVIE OBJECT
        const med = {
            id_med: req.body.id_med,
            price: req.body.price,
            Name_meds: req.body.Name_meds,
            description_meds: req.body.description_meds,
            Expiration_date: req.body.Expiration_date,
            userfid: req.body.userfid,
            namefcategory: req.body.namefcategory,
    
        };
  
        // 4 - INSERT MOVIE INTO DB
        const query = util.promisify(conn.query).bind(conn);
        await query("insert into medicine_model set ? ", med);
        res.status(200).json({
          msg: "med created successfully !",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );

  //UPDATE MED
  router.put(
    "/:id_med", // params
  
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF med EXISTS OR NOT
        const med = await query("select * from medicine_model where id_med = ?", [
          req.params.id_med,
        ]);
        if (!med[0]) {
          res.status(404).json({ ms: "med not found !" });
        }
        // 4- UPDATE med
        await query("update medicine_model set price = ? where id_med = ?", [req.body.price, med[0].id_med])
       console.log(req.params.id_med)
        console.log(req.body.price)
       
        res.status(200).json({
          msg: "med updated successfully",
        });

      } catch (err) {
        console.log(req.params.id_med)
        console.log(req.body.price)
       
        res.status(500).json(err);
      }
    }
  );



   //DELETE MED
  router.delete(
    "/delete/:id_med", // params
    async (req, res) => {
      try {
        // 1- CHECK IF med EXISTS OR NOT
        const query = util.promisify(conn.query).bind(conn);
        const med = await query("select * from medicine_model where id_med = ?", [
          req.params.id_med,
        ]);
        if (!med[0]) {
          res.status(404).json({ ms: "med not found !" });
        }
        // 2- REMOVE med 
        await query("DELETE FROM medicine_model WHERE id_med= ?", [med[0].id_med]);
        res.status(200).json({
          msg: "med delete successfully",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  );
   

  
  // LIST & SEARCH BY THE NAME OF THE MED [ADMIN, USER]
  router.get("", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
      // QUERY PARAMS
      search = `where Name_meds LIKE '%${req.query.search}%'`;
    }
    const medicine_model = await query(`select * from medicine_model ${search}`);
    medicine_model.map((medicine_model) => {
    });
    res.status(200).json(medicine_model);
  });
    

  
  
  
    // FILTER BY IDofadmin
  router.get("/:userfid", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const med = await query("select * from medicine_model where userfid = ?", [
      req.params.userfid,
    ]);
    if (!med[0]) {
      res.status(404).json({ ms: "id not found !" });
    }
    res.status(200).json(med);
  });
  


   // FILTER BY namefcategory
   router.get("/category/:namefcategory", 
   async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const med = await query("select * from medicine_model where namefcategory = ?", [
      req.params.namefcategory
    ]);
    if (!med[0]) {
      res.status(404).json({ ms: "name of category not found !" });
    }
    res.status(200).json(med);
  });


   

module.exports = router;