import { expect } from "chai";
import { IPixelateInput } from "../src/ts/cores/pixelate/pixelate";
import PixelCalc from "../src/ts/cores/pixelate/pixelCalc";

describe("pixelate", () => {
  it("pixelCalc input and output", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 255, 1, 1, 1, 255,
        2, 2, 2, 255, 2, 2, 2, 255,
      ]),
      width: 2,
      height: 2,
    };
    const input: IPixelateInput = {
      imageData,
      widthPerPixel: 2,
      heightPerPixel: 2,
    };
    const output = {
      data: new Uint8ClampedArray([
        1, 1, 1, 255, 1, 1, 1, 255,
        1, 1, 1, 255, 1, 1, 1, 255,
      ]),
      width: 2,
      height: 2,
    };

    const pixelCalc = new PixelCalc(input);
    const pixelatedImageData = pixelCalc.calcPixelatedImageData();

    expect(pixelatedImageData).to.deep.equal(output);
  });

  it("pixel size larger than max", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 255, 1, 1, 1, 255,
        2, 2, 2, 255, 2, 2, 2, 255,
      ]),
      width: 2,
      height: 2,
    };
    const input: IPixelateInput = {
      imageData,
      widthPerPixel: 4,
      heightPerPixel: 5,
    };
    const output = {
      data: new Uint8ClampedArray([
        1, 1, 1, 255, 1, 1, 1, 255,
        1, 1, 1, 255, 1, 1, 1, 255,
      ]),
      width: 2,
      height: 2,
    };

    const pixelCalc = new PixelCalc(input);
    const pixelatedImageData = pixelCalc.calcPixelatedImageData();

    expect(pixelatedImageData).to.deep.equal(output);
  });

  it("pixel size less than zero", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 255, 1, 1, 1, 255,
        2, 2, 2, 255, 2, 2, 2, 255,
      ]),
      width: 2,
      height: 2,
    };
    const input: IPixelateInput = {
      imageData,
      widthPerPixel: -2,
      heightPerPixel: 2,
    };
    const output = {
      data: new Uint8ClampedArray([
        1, 1, 1, 255, 2, 2, 2, 255,
        1, 1, 1, 255, 2, 2, 2, 255,
      ]),
      width: 2,
      height: 2,
    };

    const pixelCalc = new PixelCalc(input);
    const pixelatedImageData = pixelCalc.calcPixelatedImageData();

    expect(pixelatedImageData).to.deep.equal(output);
  });

  it("pixel size is not int", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 255, 1, 1, 1, 255,
        2, 2, 2, 255, 2, 2, 2, 255,
      ]),
      width: 2,
      height: 2,
    };
    const input: IPixelateInput = {
      imageData,
      widthPerPixel: 1.75,
      heightPerPixel: 2,
    };
    const output = {
      data: new Uint8ClampedArray([
        1, 1, 1, 255, 1, 1, 1, 255,
        1, 1, 1, 255, 1, 1, 1, 255,
      ]),
      width: 2,
      height: 2,
    };

    const pixelCalc = new PixelCalc(input);
    const pixelatedImageData = pixelCalc.calcPixelatedImageData();

    expect(pixelatedImageData).to.deep.equal(output);
  });
});
