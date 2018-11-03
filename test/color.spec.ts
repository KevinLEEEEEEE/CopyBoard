import { expect } from "chai";
import { Hex, IHex } from "../src/ts/cores/color/hex";
import { IRGB, RGB } from "../src/ts/cores/color/rgb";
import Pixelate from "../src/ts/cores/pixelate/pixelate";

describe("color", () => {
  describe("rgb color", () => {
    it("rgb input and output", () => {
      const data: IRGB = { r: 10, g: 10, b: 10 };
      const rgb = new RGB(data);
      const output = rgb.getRGB();

      expect(output).to.be.deep.equal(data);
    });

    it("rgb to hex", () => {
      const data: IRGB = { r: 10, g: 10, b: 10 };
      const rgb = new RGB(data);
      const output = rgb.getHex();

      expect(output).to.be.deep.equal({ hex: "#0a0a0a" });
    });

    it("rgb over 255", () => {
      const data: IRGB = { r: 300, g: 10, b: 500 };
      const rgb = new RGB(data);
      const output = rgb.getRGB();

      expect(output).to.be.deep.equal({ r: 255, g: 10, b: 255 });
    });

    it("rgb less than 0", () => {
      const data: IRGB = { r: -10, g: 10, b: -100 };
      const rgb = new RGB(data);
      const output = rgb.getRGB();

      expect(output).to.be.deep.equal({ r: 0, g: 10, b: 0 });
    });
  });

  describe("hex color", () => {
    it("hex input and output", () => {
      const data: IHex = { hex: "#0a0a0a" };
      const hex = new Hex(data);
      const output = hex.getHex();

      expect(output).to.be.deep.equal(data);
    });

    it("hex to rgb", () => {
      const data: IHex = { hex: "#0a0a0a" };
      const hex = new Hex(data);
      const output = hex.getRGB();

      expect(output).to.be.deep.equal({ r: 10, g: 10, b: 10 });
    });

    it("incorrect hex", () => {
      const data: IHex = { hex: "#0a0a0Z" };
      const hex = new Hex(data);
      const output = hex.getHex();

      expect(output).to.be.deep.equal({ hex: "#000000" });
    });

    it("incorrect hex to rgb", () => {
      const data: IHex = { hex: "#0a0a0Z" };
      const hex = new Hex(data);
      const output = hex.getRGB();

      expect(output).to.be.deep.equal({ r: 0, g: 0, b: 0 });
    });
  });
});
