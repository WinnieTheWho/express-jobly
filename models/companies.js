/** Company class for jobly */

const db = require("../db");
const ExpressError = require("../helpers/expressError");


/** companies */

class Companies {
  
  static async getAllCompanies(queryDataObj) {
    let querySearch = `SELECT handle, name FROM companies`;
    let min = Number(queryDataObj.min_employees);
    let max = Number(queryDataObj.max_employees);
    let search = queryDataObj.search;
    //TODO: MAKE ARRAY FOR SQL QUERY SEARCH 
    let values = [];

    if (queryDataObj) {
      if (min > max) {
        throw new ExpressError(`Minimum number of empoloyees must be greater than maximum number of employees`, 400);
      }

      if (min) {
        values.push(min);
        querySearch += ` WHERE num_employees >= $${values.length}`
      }

      if (max) {
        values.push(max);
        if (values.length === 1) {
          querySearch += ` WHERE num_employees <= $1`
        } else {
          querySearch += ` AND num_employees < $${values.length}`
        }
      }

      if (search) {
        values.push(search);
        if (values.length === 1) {
          querySearch += ` WHERE name LIKE $1`
        } else {
          querySearch += ` AND name LIKE $${values.length}`
        }
      }
      const result = await db.query(querySearch, values)
      if (result.rowCount === 0) {
        throw new ExpressError(`No results were found`)
      }
      return result.rows;
    } else {
      const result = await db.query(querySearch)
      return result.rows;
    }
  }

  static async createCompany({ handle, name, num_employees, description, logo_url }) {
    const result = await db.query(
      `INSERT INTO companies (
        handle,
        name,
        num_employees,
        description,
        logo_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING handle, name, num_employees, description, logo_url`,
      [handle, name, num_employees, description, logo_url]
    );

    return result.rows[0];
  }

  static async getCompany(handle) {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
      FROM companies WHERE handle = $1`, [handle]
    );

    let company = result.rows[0];

    if (!company) {
      throw new ExpressError(`No such company found: ${handle}`, 404);
    }

    const jobs = await db.query(
      `SELECT id, title, salary, equity
            FROM jobs 
            WHERE company_handle = $1`,
      [handle]
    );

    company.jobs = jobs.rows;

    return company;
  }

  static async updateCompany({ id, name, num_employees, description, logo_url }) {
    const result = await db.query(
      `UPDATE companies
      SET name = $1, num_employees = $2, description = $3, logo_url = $4 
      WHERE handle = $5
      RETURNING handle, name, num_employees, description, logo_url`, 
      [name, num_employees, description, logo_url, id]
    );

    if (!result.rows[0]) {
      throw new ExpressError(`No such company found: ${id}`, 404);
    }

    return result.rows[0];
  }

  static async deleteCompany(id) {
    const result = await db.query(
      `DELETE FROM companies
        WHERE handle = $1
        RETURNING name`, [id]
    );

    if (!result.rows[0]) {
      throw new ExpressError(`No such company found: ${id}`, 404);
    }

    return result.rows[0].name;
  }
}

module.exports = Companies; 