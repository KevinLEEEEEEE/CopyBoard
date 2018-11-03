import IRGB from "./IRGB";
import IHex from "./IHex";

export default class ColorConversion {
  public rgbToHex({ r, g, b }: IRGB): IHex {
    const hex =  "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);

    return { hex };
  }

  public hexToRgb({ hex }: IHex): IRGB {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const tmpHex = hex.replace(shorthandRegex, (r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(tmpHex);

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
