const express = require("express");

const {
    register,
    login,
    createFinancialRecords,
    getFinancialRecords,
    updateFinancialRecords,
    deleteFinancialRecords,
} = require("./controllers");



module.exports = route;