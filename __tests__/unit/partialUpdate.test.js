const sqlForPartialUpdate = require("../../helpers/partialUpdate")

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field",
      function () {
    // FIXME: write real tests!
    let result = sqlForPartialUpdate("companies", {"apple": 5, "ibm": 8, "lenux": 10, "_nomoney": 15}, "apple", 1);
    expect(result.values).toEqual([5, 8, 10, 1]);
    expect(result.query).toEqual("UPDATE companies SET apple=$1, ibm=$2, lenux=$3 WHERE apple=$4 RETURNING *");
  });
});
