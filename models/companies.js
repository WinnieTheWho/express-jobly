/** Message class for jobly */

const db = require("../db");
const ExpressError = require("../expressError");


/** companies */

class Companies {

  static async getAllCompanies(queryObj) {
    let result;
    let select;
    let join;
    let where;

    if (queryObj) {
      // console.log("OBJECT VALUES:", queryObj.search, queryObj.min, queryObj.max )
      if (queryObj.search && queryObj.min && queryObj.max) {

        // select = "name";
        // join = "JOIN jobs ON companies.handle = jobs.company_handle";
        // where = `companies.num_employees > $1 AND companies.num_employees < $2`
        // let queryString = `SELECT handle, ${select} FROM companies ${join} WHERE ${where}`;
        // console.log("QUERY STRING:", queryString)
        // result = await db.query(queryString, [queryObj.min, queryObj.max])
        result = await db.query(
          `SELECT name, handle FROM companies
                    WHERE companies.num_employees > ${Number(queryObj.min)} AND companies.num_employees < ${Number(queryObj.max)}`
        );
      }

      // if (queryObj === search) {
      //     result = await db.query(
      //         `SELECT handle, name FROM companies
      //          WHERE name = $1 `,
      //         [filter])
      // } else if (term === min_employee) {
      //     result = await db.query(
      //         `SELECT titles, handle FROM companies
      //          JOIN jobs ON companies.handle = jobs.company_handle
      //          WHERE companies.num_employees > $1 `,
      //         [filter])
      // } else if (term === max_employee) {
      //     result = await db.query(
      //         `SELECT titles, handle FROM companies
      //          JOIN jobs ON companies.handle = jobs.company_handle
      //          WHERE companies.num_employees < $1 `,
      //         [filter])
      // }
      // } else {
      //     result = await db.query(
      //         `SELECT handle, name FROM companies`
      //     );
      // }



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

    if(!result.rows[0]){
      throw new ExpressError(`No such company found: ${id}`, 404);
    }

    return result.rows[0];
  }

  static async deleteCompany (id){
    const result = await db.query(
      `DELETE FROM companies
      WHERE handle = $1
      RETURNING name`, [id]
    );

    if(!result.rows[0]){
      throw new ExpressError(`No such company found: ${id}`, 404);
    }

    console.log("RESULT DELETED:", result.rows[0])
    return result.rows[0].name;
  }
}

module.exports = Companies; 