const express = require('express');
const { Router } = express;
// const jsonschema = require("jsonschema");
const ExpressError = require("../helpers/expressError");
const Jobs = require("../models/jobs");



const router = new Router();

/** ROUTES for JOBS*/
router.post("/", async function (req, res, next) {
  const { title, salary, equity, company_handle, date_posted } = req.body
  const job = await Jobs.createJob(req.body);

  return res.json({ job });
});

module.exports = router; 