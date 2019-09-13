/** Jobs class for jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Jobs {

  static async createJob({ title, salary, equity, company_handle }) {
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
    let querySearch = `SELECT title, company_handle FROM jobs`;
    let order = ` ORDER BY date_posted DESC`;
    let minSalary = queryDataObj.min_salary;
    let minEquity = queryDataObj.min_equity;
    let search = queryDataObj.search;
    let values = [];

    //If query data has values => filter search 
    if (queryDataObj) {

      if (minSalary) {
        values.push(minSalary);
        querySearch += ` WHERE salary >= $1`;
      }

      if (minEquity) {
        values.push(minEquity);
        if (values.length === 1) {
          querySearch += ` WHERE equity >= $1`
        }
        querySearch += ` AND equity >= $${values.length}`;
      }

      if (search) {
        values.push(search);
        if (values.length === 1) {
          querySearch += ` WHERE company_handle LIKE $1`
        }
        querySearch += ` AND company_handle LIKE $${values.length}`;
      }

      let resultQuery = querySearch + order;
      const result = await db.query(resultQuery, values);
      return result.rows;

    }
    // If no query data => return all  
    else {

      let resultQuery = querySearch + order;
      const result = await db.query(querySeaerch);
      return result.rows;
    }
  }

  static async getJob(id){
    const result = await db.query(
      `SELECT * FROM jobs
       WHERE id = $1`, 
       [id]
    )

    let job = result.rows[0];

    if (!job) {
      throw new ExpressError(`No job with id:${ id} found`, 404);
    };

    return job;
  }

  static async updateJob({id, title, salary, equity, company_handle}) {
    const result = await db.query(
      `UPDATE jobs 
       SET title = $1, salary = $2, equity = $3, 
                   company_handle = $4, date_posted = current_timestamp 
       WHERE id = $5 
       RETURNING id, title, salary, equity, company_handle, date_posted`, 
       [title, salary, equity, company_handle, id]
    );
    
    if (!result.rows[0]) {
      throw new ExpressError(`No job with id:${id} found`, 404);
    };

    return result.rows[0];
  }

  static async deleteJob(id){
    const result = await db.query(
      `DELETE from jobs 
       WHERE id = $1
       RETURNING title`, 
       [id]
    );
    
    if (!result.rows[0]) {
      throw new ExpressError(`No job with id:${id} found`, 404);
    }

    return result.rows[0].title;

  }


}



module.exports = Jobs;