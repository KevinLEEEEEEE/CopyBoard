import IRGB from "./IRGB";
import IHex from "./IHex";
import Color from "./color";

export default class RGB extends Color {
  constructor(rgb: IRGB) {
    super(rgb);
  }

  public getRGB(): IRGB {
    return this.color;
  }

  public getHex(): IHex {
    return this.rgbToHex(this.color);
  }
}