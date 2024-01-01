const router = require("express").Router();
const conn = require("../db/dbconnection");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");



// LOGIN
router.post(
    "/login",
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("password").isLength({ min: 1, max: 12 })
      .withMessage("password should be between (1-12) character"),
    async (req, res) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF EMAIL EXISTS
        // method can be used to convert the callback-based query() method into a promise-based function
        
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const user = await query("select * from user_model where email = ? ", [
          req.body.email,
        ]);
        if (user.length == 0) {
          res.status(404).json({
            errors: [
              {
                msg: "email or password not found !",
              },
            ],
          });
        }
        // 3- COMPARE HASHED PASSWORD
      const checkPassword = await bcrypt.compare( 
        req.body.password,
        user[0].password
      );
      if (checkPassword) {
        delete user[0].password;
        res.status(200).json(user[0]);
      } else {
        res.status(404).json({
          errors: [
            {
              msg: "email or password not found !",
            },
          ],
        });
      }
    
      } catch (err) {
        res.status(500).json({ err: err });
      }
    }
  );



  
module.exports = router;
//admin2 pass:admin2