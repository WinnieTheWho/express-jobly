const Router = require("express").Router;
const express = require('express');
// const User = require('../models/user');
const Companies = require("../models/companies");

const router = new Router();

router.get("/", async function (req, res, next) {
  try {
    let companies;
    console.log("REQUEST.QUERY:", req.query);

    if (req.query) {
      companies = await Companies.getAllCompanies(req.query);
    }

    companies = await Companies.getAllCompanies();
    return res.json({ companies });
  }
  catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { handle, name, num_employees, description, logo_url } = req.body;
    const company = await Companies.createCompany({ handle, name, num_employees, description, logo_url });

    return res.json(company)
  }
  catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const company = await Companies.getCompany(id);

    return res.json(company)
  }
  catch (err) {
    return next(err);
  }
});

router.patch("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const { name, num_employees, description, logo_url } = req.body;
    const company = await Companies.updateCompany(id, name, num_employees, description, logo_url);

    return res.json(company)
  }
  catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const company = await Companies.deleteCompany(id);

    const message = `${company} was removed`

    return res.json({message})
  }
  catch (err) {
    return next(err);
  }
})

module.exports = router; 