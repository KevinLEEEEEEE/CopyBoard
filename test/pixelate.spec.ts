import { expect } from "chai";
import Pixelate from "../src/ts/cores/pixelate";

describe("pixelate", () => {
  describe("default 16 * 16 array", () => {
    it("defsult test", () => {
      const data = new Uint8ClampedArray([
        1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
        0, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
        0, 0, 3, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
        0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
        0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
        0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
        0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
        0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3,
      ]);
      const imageData = new ImageData(data, 4, 4);
      // const pixelate = new Pixelate(imageData);

      // pixelate.getPixelatedImageData(2, 2);
    });
  });
});
