import { IHex } from "./hex";
import { IRGB } from "./rgb";

export default abstract class Color<T> {
  protected readonly color: T;

  constructor(color: T) {
    this.color = this.validate(color);
  }

  public abstract getRGB(): IRGB;
  public abstract getHex(): IHex;
  public abstract validate(color: T): T;

  protected rgbToHex({ r, g, b }: IRGB): IHex {
    const hex =  "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);

    return { hex };
  }

  protected hexToRgb({ hex }: IHex): IRGB {
    const hexSplitRegex: RegExp = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    const shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    const completedHex = hex.replace(shorthandRegex, (r, g, b) => { // #ac3 => #aacc33
      return r + r + g + g + b + b;
    });

    const splittedHex = hexSplitRegex.exec(completedHex); // #aacc33 => ["aa", "cc", "33"]

    return this.getRGBFromSplittedHex(splittedHex);
  }

  private getRGBFromSplittedHex(splittedHex: string[]): IRGB {
    return splittedHex ? {
      r: parseInt(splittedHex[1], 16),
      g: parseInt(splittedHex[2], 16),
      b: parseInt(splittedHex[3], 16),
     } : { r: 0, g: 0, b: 0 };
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);

    return hex.length === 1 ? "0" + hex : hex;
  }
}
