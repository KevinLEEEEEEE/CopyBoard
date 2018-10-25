import { expect } from "chai";
import Pixelate from "../src/ts/utils/pixelate";

describe("pixelate", () => {
  describe("default 16 * 16 array", () => {
    it("defsult test", () => {
      const testImageData = {
        data: [ 1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
          0, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
          0, 0, 3, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
          0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
          0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
          0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
          0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
          0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
        ],
        width: 4,
        height: 4,
      };
      const pixelate = new Pixelate(testImageData);

      pixelate.getPixelatedImageData(2, 2);
    });
  });
});
