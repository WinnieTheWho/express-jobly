const express = require('express');
const { Router } = express;
const jsonschema = require("jsonschema");
const ExpressError = require("../helpers/expressError");
const Jobs = require("../models/jobs");
const jobsSchema = require("../schemas/jobsSchema");

const router = new Router();


/** POST / => post new job to jobs table*/
router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(req.body, jobsSchema);

  if (!result.valid) {
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }

  const data = req.body.job
  const job = await Jobs.createJob(data);

  return res.json({ job }, 201);
});

/** GET / => list of companies */
router.get("/", async function (req, res, next) {
  try {
    const jobs = await Jobs.getJobs(req.query);
    return res.json({ jobs });
  }
  catch (err) {
    return next(err);
  }
});

/** GET /:id => list of companies */
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id
    const jobs = await Jobs.getJob(id);
    return res.json({ jobs });
  }
  catch (err) {
    return next(err);
  }
});

/** PATCH /:id => update details of one job */
router.patch("/:id", async function(req, res, next){
  const result = jsonschema.validate(req.body, jobsSchema);

  if (!result.valid) {
    let listOfErrors = result.errors.map(error => error.stack);
    let error = new ExpressError(listOfErrors, 400);
    return next(error);
  }
  
  const data = req.body.jobs
  const job = await Jobs.updateJob(data);

  return res.json({ job })
})

/** DELETE /:id => delete one job from database */
router.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const job = await Jobs.deleteJob(id);

    const message = `The job ${job} was removed`

    return res.json({ message })
  }
  catch (err) {
    return next(err);
  }
})

module.exports = router; 