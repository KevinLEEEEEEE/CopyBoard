import { expect } from "chai";
import { IRGB } from "../src/ts/cores/color/rgb";
import FloodFill from "../src/ts/cores/floodFill/floodFill";

describe("floodFill", () => {
  it("solid object", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 0, 1, 1, 1, 255, 0, 0, 0, 0, 1, 1, 1, 255,
        0, 0, 0, 0, 2, 2, 2, 255, 2, 2, 2, 255, 0, 0, 0, 0,
        2, 2, 2, 255, 2, 2, 2, 255, 2, 2, 2, 255, 2, 2, 2, 255,
        2, 2, 2, 255, 2, 2, 2, 255, 2, 2, 2, 255, 2, 2, 2, 255,
      ]),
      width: 4,
      height: 4,
    };
    const rgb: IRGB = { r: 10, g: 10, b: 10 };
    const outputImageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 0, 1, 1, 1, 255, 0, 0, 0, 0, 1, 1, 1, 255,
        0, 0, 0, 0, 10, 10, 10, 255, 10, 10, 10, 255, 0, 0, 0, 0,
        10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255,
        10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255,
      ]),
      width: 4,
      height: 4,
    };

    const clickPoint = { x: 1, y: 2 };
    const floodFillInstance = new FloodFill(imageData);
    const floodFilledImageData = floodFillInstance.getFloodFilledImageData(clickPoint, rgb);

    expect(floodFilledImageData).to.be.deep.equal(outputImageData);
  });

  it("solid object", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
      width: 4,
      height: 4,
    };
    const rgb: IRGB = { r: 10, g: 10, b: 10 };
    const outputImageData = {
      data: new Uint8ClampedArray([
        10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255,
        10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255,
        10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255,
        10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255,
      ]),
      width: 4,
      height: 4,
    };

    const clickPoint = { x: 1, y: 2 };
    const floodFillInstance = new FloodFill(imageData);
    const floodFilledImageData = floodFillInstance.getFloodFilledImageData(clickPoint, rgb);

    expect(floodFilledImageData).to.be.deep.equal(outputImageData);
  });

  it("hollow object with border in different color", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 0, 20, 20, 20, 255, 20, 20, 20, 255, 0, 0, 0, 0,
        20, 20, 20, 255, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 255,
        20, 20, 20, 255, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 255,
        0, 0, 0, 0, 20, 20, 20, 255, 20, 20, 20, 255, 0, 0, 0, 0,
      ]),
      width: 4,
      height: 4,
    };
    const rgb: IRGB = { r: 10, g: 10, b: 10 };
    const outputImageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 0, 20, 20, 20, 255, 20, 20, 20, 255, 0, 0, 0, 0,
        20, 20, 20, 255, 10, 10, 10, 255, 10, 10, 10, 255, 20, 20, 20, 255,
        20, 20, 20, 255, 10, 10, 10, 255, 10, 10, 10, 255, 20, 20, 20, 255,
        0, 0, 0, 0, 20, 20, 20, 255, 20, 20, 20, 255, 0, 0, 0, 0,
      ]),
      width: 4,
      height: 4,
    };

    const clickPoint = { x: 1, y: 2 };
    const floodFillInstance = new FloodFill(imageData);
    const floodFilledImageData = floodFillInstance.getFloodFilledImageData(clickPoint, rgb);

    expect(floodFilledImageData).to.be.deep.equal(outputImageData);
  });

  it("hollow object with border in same different color", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 0, 10, 10, 10, 255, 10, 10, 10, 255, 0, 0, 0, 0,
        10, 10, 10, 255, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 255,
        10, 10, 10, 255, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 255,
        0, 0, 0, 0, 10, 10, 10, 255, 10, 10, 10, 255, 0, 0, 0, 0,
      ]),
      width: 4,
      height: 4,
    };
    const rgb: IRGB = { r: 10, g: 10, b: 10 };
    const outputImageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 0, 10, 10, 10, 255, 10, 10, 10, 255, 0, 0, 0, 0,
        10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255,
        10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255, 10, 10, 10, 255,
        0, 0, 0, 0, 10, 10, 10, 255, 10, 10, 10, 255, 0, 0, 0, 0,
      ]),
      width: 4,
      height: 4,
    };

    const clickPoint = { x: 1, y: 2 };
    const floodFillInstance = new FloodFill(imageData);
    const floodFilledImageData = floodFillInstance.getFloodFilledImageData(clickPoint, rgb);

    expect(floodFilledImageData).to.be.deep.equal(outputImageData);
  });

  it("fill empty canvas with black color", () => {
    const imageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
      width: 4,
      height: 4,
    };
    const rgb: IRGB = { r: 0, g: 0, b: 0 };
    const outputImageData = {
      data: new Uint8ClampedArray([
        0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
        0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
        0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
        0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
      ]),
      width: 4,
      height: 4,
    };

    const clickPoint = { x: 1, y: 2 };
    const floodFillInstance = new FloodFill(imageData);
    const floodFilledImageData = floodFillInstance.getFloodFilledImageData(clickPoint, rgb);

    expect(floodFilledImageData).to.be.deep.equal(outputImageData);
  });
});
