/** Jobs class for jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Jobs {

  static async createJob({ title, salary, equity, company_handle, date_posted }) {
    const result = await db.query(
      `INSERT INTO jobs (
        title, 
        salary, 
        equity, 
        company_handle,
        date_posted
      )
      VALUES ($1, $2, $3, $4, current_timestamp)
      RETURNING title, salary, equity, company_handle, date_posted`,
      [title, salary, equity, company_handle]
    );

    return result.rows[0];
  }

  static async getJobs(queryDataObj) {
    let querySearch = [`SELECT title, company_handle FROM jobs`];
    let minSalary = queryDataObj.min_salary;
    let minEquity = queryDataObj.min_equity;
    let search = queryDataObj.search;
    let values = [];

    if(queryDataObj){
      if(minSalary){
        values.push(minSalary);
        querySearch.push(`WHERE min_salary >= $${values.length}`);
        const result = await db.query(querySearch.join(","), values);
        return result.rows;
      }
    }


  }

}


module.exports = Jobs;