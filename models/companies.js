/** Message class for jobly */

const db = require("../db");
const ExpressError = require("../expressError");


/** companies */

class Companies {

  static async getAllCompanies(queryObj) {
    let result;

    if (queryObj) {
      let min = Number(queryObj.min);
      let max = Number(queryObj.max);
      let name = queryObj.search;

      if (min > max) {
        throw new ExpressError(`Minimum number of empoloyees can not be greater than maximum number of employees`, 400);
      }

      if (queryObj.search && queryObj.min && queryObj.max) {
        result = await db.query(
          `SELECT name, handle FROM companies
           JOIN jobs  
           WHERE num_employees > $1 
           AND num_employees < $2
            AND name = $3`, [min, max, name]);
      } else {
        result = await db.query(
          `SELECT handle, name FROM companies`
        );
      }

      let companies = result.rows;
      return companies;
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
    return company;
  }

  static async updateCompany(id, name, num_employees, description, logo_url) {
    const result = await db.query(
      `UPDATE companies
      SET name = $1, num_employees = $2, description = $3, logo_url = $4 
      WHERE handle = $5
      RETURNING handle, name, num_employees, description, logo_url`, [name, num_employees, description, logo_url, id]
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

    console.log("RESULT DELETED:", result.rows[0])
    return result.rows[0].name;
  }
}

module.exports = Companies; 