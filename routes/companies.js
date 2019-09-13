const express = require('express');
const { Router } = express;
const jsonschema = require("jsonschema");
const ExpressError = require("../helpers/expressError");
const Companies = require("../models/companies");
const companySchema = require("../schemas/companiesSchema");


const router = new Router();


/** GET / => list of companies */
router.get("/", async function (req, res, next) {
  try {
    const companies = await Companies.getAllCompanies(req.query);
    return res.json({ companies });
  }
  catch (err) {
    return next(err);
  }
});

/**  POST / => creates new company  */
router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(req.body, companySchema);

  if (!result.valid) {
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  const { handle, name, num_employees, description, logo_url } = req.body.company;
  const company = await Companies.createCompany({ handle, name, num_employees, description, logo_url });

  return res.json({ company }, 201);

});

/** GET /:id => details of one company */
router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const company = await Companies.getCompany(id);

    return res.json({ company })
  }
  catch (err) {
    return next(err);
  }
});

/** PATCH /:id => update details of one company */
router.patch("/:id", async function (req, res, next) {
  const result = jsonschema.validate(req.body, companySchema)

  if (!result.valid) {
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  const { id } = req.params;
  const { name, num_employees, description, logo_url } = req.body.company;
  //TODO: MAKE INPUT INTO OBJECT 
  const company = await Companies.updateCompany({id, name, num_employees, description, logo_url});

  return res.json({ company })

});

/** DELETE /:id => delete one company from database */
router.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const company = await Companies.deleteCompany(id);

    const message = `${company} was removed`

    return res.json({ message })
  }
  catch (err) {
    return next(err);
  }
})

module.exports = router; 