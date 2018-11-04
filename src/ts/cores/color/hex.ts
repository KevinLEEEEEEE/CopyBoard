import Color from "./color";
import { IRGB } from "./rgb";

interface IHex {
  hex: string;
}

class Hex extends Color {
  private hex: IHex;

  constructor(hex: IHex) {
    super();

    this.hex = this.validate(hex);
  }

  public getRGB(): IRGB {
    return this.hexToRgb(this.hex);
  }

  public getHex(): IHex {
    return this.hex;
  }

  public validate({ hex }: IHex): IHex {
    const hexTestRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    const isCorrextHex = hexTestRegex.test(hex);

    if (isCorrextHex === true) {
      return { hex };
    } else {
      return { hex: "#000000" };
    }
  }
}

export {
  IRGB,
  IHex,
  Hex,
};
