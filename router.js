const express = require("express");
const router = express.Router();
const {
    register,
    login,
    createFinancialRecord,
    getFinancialRecords,
    updateFinancialRecord,
    deleteFinancialRecord,
} = require("./controllers");

router.post("/financialrecord/create", createFinancialRecord);
router.get("/financialrecords", getFinancialRecords);
router.put("/financialrecord/:id/update", updateFinancialRecord);
router.delete("/financialrecord/:id/delete", deleteFinancialRecord);


module.exports = router;