const express = require("express");
const router = express.Router(); // Create an instance of Router express to define routes

// Import modules from controllers.js
const {
    register,
    login,
    createFinancialRecord,
    getFinancialRecords,
    updateFinancialRecord,
    deleteFinancialRecord,
} = require("./controllers");

const jwt = require("jsonwebtoken");

// Routers for register and login
router.post("/register", register);
router.post("/login", login);

// Validate the token
router.use((req, res, next) => {
    const authHeader = req.headers["token"];
    const token = authHeader;
  
    if (token == null) {
      return res.status(401).json({ error: "Token does not exist, access denied" });
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(403).json({ error: "Invalid token" });
    } else {
      req.user = verifyToken;
      next();
    }
});

// Routers for CRUD operations
router.post("/financialrecord/create", createFinancialRecord);
router.get("/financialrecords", getFinancialRecords);
router.patch("/financialrecord/:id/update", updateFinancialRecord);
router.delete("/financialrecord/:id/delete", deleteFinancialRecord);

// Export module for index.js
module.exports = router;