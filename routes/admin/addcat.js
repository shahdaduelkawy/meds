const router = require("express").Router();
const conn = require("../../db/dbconnection");
const admin = require("../../middleware/admin");
const authorized = require("../../middleware/authorize");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs"); // file system




// CREATE category [ADMIN]
router.post(
  "",
  body("Name_Category")
    .isString()
    .withMessage("please enter a valid Name_Category")
    .isLength({ min: 2 })
    .withMessage("NameCategory name should be at lease 2 characters"),

    body("id")
    .isString()
    .withMessage("please enter a valid id")
    .isLength({ min: 1 })
    .withMessage("id should be at lease number"),

  body("description_Category")
    .isString()
    .withMessage("please enter a valid description ")
    .isLength({ min: 2 })
    .withMessage("description name should be at lease 2 characters"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

        // 2- PREPARE category OBJECT
      const category = {
        Name_Category: req.body.Name_Category,
        id: req.body.id,
        description_Category: req.body.description_Category,
      };

      // 3 - INSERT category INTO DB
      const query = util.promisify(conn.query).bind(conn);
      await query("insert into category_model set ? ", category);
      res.status(200).json({
        msg: "category created successfully !",
      });

    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  }
);

//UPDATE description_Category 
router.put(
  "/update/:id", // params
  
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF category EXISTS OR NOT
      const category = await query("select * from category_model where id = ?", [
        req.params.id,
      ]);
      if (!category[0]) {
        res.status(404).json({ ms: "category not found !" });
      }
      // 4- UPDATE category
      await query("update category_model set description_Category = ? where id = ?", [req.body.description_Category, category[0].id])
     console.log(req.params.id)
      console.log(req.body.description_Category)
     
      res.status(200).json({
        msg: "category updated successfully",
      });

    } catch (err) {
      console.log(req.params.id)
      console.log(req.body.description_Category)
     
      res.status(500).json(err);
    }
  }
);


 //DELETE category
router.delete(
  "/delete/:id", // params
  async (req, res) => {
    try {
      // 1- CHECK IF category EXISTS OR NOT
      const query = util.promisify(conn.query).bind(conn);
      const category = await query("select * from category_model where id = ?", [
        req.params.id,
      ]);
      if (!category[0]) {
        res.status(404).json({ ms: "category not found !" });
      }
      // 2- REMOVE category 
      await query("DELETE FROM category_model WHERE id= ?", [category[0].id]);
      res.status(200).json({
        msg: "category delete successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
 

// LIST & SEARCH BY THE Name_  OF THE Category 
router.get("", 
async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    // QUERY PARAMS
    search = `where Name_Category LIKE '%${req.query.search}%'`;
  }
  const category_model = await query(`select * from category_model ${search}`);
  category_model.map((category_model) => {
  });
  res.status(200).json(category_model);
});
  



  module.exports = router;
  