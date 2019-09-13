const request = require("supertest");
const db = require("../../db");
const app = require("../../app");

const Companies = require("../../models/jobs");
const Companies = require("../../models/companies");


describe("Jobs Routes Test", function () {

	beforeEach(async function () {
		await db.query("DELETE FROM jobs")
		await db.query("DELETE FROM companies")

		await Companies.createCompany({
			handle: "testcomp1",
			name: "testing123",
			num_employees: 50,
			description: "testing file",
			logo_url: "none"
		});

		await Jobs.createJob({
			title: "testjob1",
			salary: 5000,
			equity: 0.01,
			company_handle: "testcomp1"
		})

		await Jobs.createJob({
			title: "testjob2",
			salary: 9999999,
			equity: 0.09,
			company_handle: "testcomp1"
		})
	})

	describe("GET /jobs", function () {
		test("get all jobs", async function () {
			let response = await request(app)
				.get("/jobs")
			expect(response.statusCode).toEqual(200);
			expect(reseponse.length).toEqual(2);
        })
	})

})