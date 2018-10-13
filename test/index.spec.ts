import { expect } from "chai";
import Calculator from "../src/ts/index";

describe("Array", () => {
  describe("#indexOf()", () => {
    it("should return -1 when the value is not present", () => {
      const calc = new Calculator();

      const res = calc.Add(2, 3);

      expect(res).to.equal(5);
    });
  });
});
