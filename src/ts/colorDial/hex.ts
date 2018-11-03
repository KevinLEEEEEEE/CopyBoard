import IRGB from "./IRGB";
import IHex from "./IHex";
import Color from "./color";

export default class Hex extends Color {
  private hex: IHex;

  public getRGB(): IRGB {
    return this.hexToRgb(this.hex);
  }

  public getHex(): IHex {
    return this.hex;
  }
}