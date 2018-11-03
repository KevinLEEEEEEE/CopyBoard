import { expect } from "chai";
import PixelBlock from "../src/ts/cores/pixelate/pixelBlock";

describe("pixelate", () => {
  it("pixelBlock", () => {
    const array = new Uint8ClampedArray([
      0, 0, 0, 255, 1, 1, 1, 255,
      2, 2, 2, 255, 3, 3, 3, 255,
    ]);
    const imageData = {
      data: array,
      width: 2,
      height: 2,
    };

    const pixelate = new PixelBlock({ imageData, pixelBlockWidth: 2, pixelBlockHeight: 2 });

    // const pixelatedData = pixelate.getPixelatedImageData(2, 2);

    // expect(pixelatedData).to.deep.equal([
    //   1.25, 1.25, 1.25, 255, 1.25, 1.25, 1.25, 255,
    //   1.25, 1.25, 1.25, 255, 1.25, 1.25, 1.25, 255,
    // ]);
  });
});
