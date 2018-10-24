import { expect } from "chai";
import Pixelate from "../src/ts/utils/pixelate";

describe("pixelate", () => {
  describe("default 9 * 9 array", () => {
    it("defsult test", () => {
      const testImageData = {
        data: [ 0, 1, 2, 3, 4, 5, 6, 7, 8,
          0, 1, 2, 3, 4, 5, 6, 7, 8,
          0, 1, 2, 3, 4, 5, 6, 7, 8,
          0, 1, 2, 3, 4, 5, 6, 7, 8,
          0, 1, 2, 3, 4, 5, 6, 7, 8,
          0, 1, 2, 3, 4, 5, 6, 7, 8,
          0, 1, 2, 3, 4, 5, 6, 7, 8,
          0, 1, 2, 3, 4, 5, 6, 7, 8,
          0, 1, 2, 3, 4, 5, 6, 7, 8,
        ],
        width: 9,
        height: 9,
      };
      const pixelate = new Pixelate(testImageData);

      pixelate.getPixelatedImageData(3);
    });
  });
});
