const router = require("express").Router();
const conn = require("../../db/dbconnection");
const admin = require("../../middleware/admin");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper





//admin can  Show the history of patient requests for medicines by  filter requests by his name


router.get("/:nameuser", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const user = await query("select * from req_model where nameofuser = ?", [
      req.params.nameuser,
    ]);
    if (!user[0]) {
      res.status(404).json({ ms: "user not found !" });
    }
    res.status(200).json(user);
  });

module.exports = router;