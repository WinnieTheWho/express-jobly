const Router = require("express").Router;
const express = require('express');
// const User = require('../models/user');
const Companies = require("../models/companies");

const router = new Router(); 

router.get("/", async function (req, res) {
    let term = req.query[0];
    let filter = req.query[1];
    const companies = await Companies.getAllCompanies(term, filter);
    console.log(companies);
    return res.json({ companies });
});

module.exports = router; 