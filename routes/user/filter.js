
const router = require("express").Router();
const conn = require("../../db/dbconnection");
const admin = require("../../middleware/admin");
const authorized = require("../../middleware/authorize");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper

//id_search, search, idfuser, timefsearch, status
router.get("/:id_user", async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    // QUERY PARAMS
    search = `where Name_meds LIKE '%${req.query.search}%'`;

    // Save the search value, time, and result to the history table
    const searchValue = req.query.search;
    const idfuser = req.params.id_user;
    const timefsearch = new Date();
    const formattedtimefsearch = timefsearch.toISOString().slice(0, 19).replace("T", " ");

    // Execute the SQL query to check if the medicine exists
    const checkQuery = "SELECT COUNT(*) AS count FROM medicine_model WHERE Name_meds LIKE ?";
    const [medicineCount] = await query(checkQuery, [`%${req.query.search}%`]);
    // status 0->not found  1->found
    const medicineExists = medicineCount.count > 0;

    // Insert the search value, user ID, search time, and search result into the history table
    const insertQuery = "INSERT INTO history (idfuser, search, timefsearch, status) VALUES (?, ?, ?, ?)";
    await query(insertQuery, [idfuser, searchValue, formattedtimefsearch, medicineExists]);
  }
  const medicine_model = await query(`select * from medicine_model ${search}`);
  if (medicine_model.length > 0) {
    res.status(200).json(medicine_model);
  } else {
    res.status(404).json({ ms: "med not found !" });
  }
});
    //id_med, price, Name_meds, description_meds, Expiration_date, userfid, namefcategory , medicine_model

  
  
    // FILTER BY ID
  router.get("/:userfid", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const med = await query("select * from medicine_model where userfid = ?", [
      req.params.userfid,
    ]);
    if (!med[0]) {
      res.status(404).json({ ms: "med not found !" });
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
      res.status(404).json({ ms: "med not found !" });
    }
    res.status(200).json(med);
  });

  
   

    module.exports = router;