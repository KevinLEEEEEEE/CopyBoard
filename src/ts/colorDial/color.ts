import IRGB from "./IRGB";
import IHex from "./IHex";

const ShorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const RGBRegex: RegExp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

export default abstract class Color {
  public abstract getRGB(): IRGB;
  public abstract getHex(): IHex;

  protected rgbToHex({ r, g, b }: IRGB): IHex {
    const hex =  "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);

    return { hex };
  }

  protected hexToRgb({ hex }: IHex): IRGB {
    const tmpHex = hex.replace(ShorthandRegex, (r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = RGBRegex.exec(tmpHex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
     } : { r: 0, g: 0, b: 0 };
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);

    return hex.length === 1 ? "0" + hex : hex;
  }
}