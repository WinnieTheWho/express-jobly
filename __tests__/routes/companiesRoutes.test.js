const request = require("supertest");
const db = require("../../db");
const app = require("../../app");

const Companies = require("../../models/companies");

describe("Companies Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM companies");

    await Companies.createCompany({
      handle: "testcomp1",
      name: "testing123",
      num_employees: 50,
      description: "testing file",
      logo_url: "noUrl"
    });

    await Companies.createCompany({
      handle: "testcomp2",
      name: "testing321",
      num_employees: 500,
      description: "testing file",
      logo_url: "noUrl"
    });

  });

  /** GET /companies => list of companies */
  describe("GET /companies", function () {
    test("get all companies", async function () {
      let response = await request(app)
        .get("/companies")
      expect(response.statusCode).toEqual(200);
      //TODO: LENGTH OF COMPANIES 
    })

    //TODO: CLARIFY SPECIFICS  
    describe("GET /companies/?min_employees=51", function () {
      test("get companies with min_employee", async function () {
        let response = await request(app)
          .get("/companies/?min_employees=51")
        expect(response.statusCode).toEqual(200);
        expect(response.body.companies[0].handle).toEqual("testcomp2")
      })
    })
  })

  //TODO: FIX KEYS REMOVE QUOTES 
  //TODO: CHECK COMPANY DETAILS 
  //TODO: TEST 404 
  /**  POST / => creates new company  */
  describe("POST /companies", function () {
    test("post new company to companies", async function () {
      let response = await request(app)
        .post("/companies")
        .send({
          company:
          {
            "handle": "testcomp3",
            "name": "testing3",
            "num_employees": 5,
            "description": "testing file",
            "logo_url": "noUrl"
          }
        })
      expect(response.statusCode).toEqual(201);
    })
  })

  /** GET /:id => details of one company */
  describe("GET /:id", function () {
    test("get one company details", async function () {
      let response = await request(app).get("/companies/testcomp1")
      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual({
        "company": {
          "handle": "testcomp1",
          "name": "testing123",
          "num_employees": 50,
          "description": "testing file",
          "logo_url": "noUrl"
        }
      })
    })
  })

  /** PATCH /:id => update details of one company */
  describe("PATCH /:id", function () {
    test("update one company details", async function () {
      let response = await request(app)
        .patch("/companies/testcomp1")
        .send({
          "company":
          {
            "handle": "testcomp3",
            "name": "testing3",
            "num_employees": 50000000,
            "description": "testing file",
            "logo_url": "noUrl"
          }
        })
      expect(response.statusCode).toEqual(200);
      expect(response.body.company.num_employees).toEqual(50000000);
    })
  })

  //TODO: MAKE GET AND CHECK FOR 404
  /** DELETE /:id => delete one company from database */
  describe("DELETE /:id", function () {
    test("delete one company", async function () {
      let response = await request(app)
        .delete("/companies/testcomp1")
      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toEqual("testing123 was removed");
    })
  })
})


afterAll(async function () {
  await db.end();
});