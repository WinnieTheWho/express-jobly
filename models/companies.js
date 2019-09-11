/** Message class for jobly */

const db = require("../db");
const ExpressError = require("../expressError");


/** companies */

class Companies {

    static async getAllCompanies(term, filter) {
        let result;
        if (term) {
            if (term === search) {
                result = await db.query(
                    `SELECT handle, name FROM companies
                     WHERE name = $1 `,
                    [filter])
            } else if (term === min_employee) {
                result = await db.query(
                    `SELECT titles, handle FROM companies
                     JOIN jobs ON companies.handle = jobs.company_handle
                     WHERE companies.num_employees > $1 `,
                    [filter])
            } else if (term === max_employee) {
                result = await db.query(
                    `SELECT titles, handle FROM companies
                     JOIN jobs ON companies.handle = jobs.company_handle
                     WHERE companies.num_employees < $1 `,
                    [filter])
            }
        } else {
            console.log("ELSE")
            result = await db.query(
                `SELECT handle, name FROM companies`
            );
        }


        let companies = result.rows;
        console.log("COMPANIES:", companies)

        return companies;
    }



}

module.exports = Companies; 