import Color from "./color";
import { IHex } from "./hex";

interface IRGB {
  r: number;
  g: number;
  b: number;
}

class RGB extends Color<IRGB> {
  constructor(rgb: IRGB) {
    super(rgb);
  }

  public getRGB(): IRGB {
    return this.color;
  }

  public getHex(): IHex {
    return this.rgbToHex(this.color);
  }

  public validate({ r, g, b }: IRGB): IRGB {
    return {
      r: this.singleParamValidater(r),
      g: this.singleParamValidater(g),
      b: this.singleParamValidater(b),
    };
  }

  private singleParamValidater(param: number): number {
    if (param > 255) {
      return 255;
    } else if (param < 0) {
      return 0;
    } else {
      return param;
    }
  }
}

export {
  IRGB,
  IHex,
  RGB,
};
