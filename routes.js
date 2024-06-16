const { Router } = require("express");
const router = Router();

const {
    register,
    login,
    createFinancialRecords,
    getFinancialRecords,
    updateFinancialRecords,
    deleteFinancialRecords,
} = require("./controllers");



module.exports = router;