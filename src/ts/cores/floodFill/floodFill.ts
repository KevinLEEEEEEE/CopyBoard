import { IRGB, IRGBA } from "../color/rgb";

const SIZEOF_RGBA = 4; // [r, g, b, a]

interface IPoint {
  x: number;
  y: number;
}

export default class FloodFill {
  private readonly imageData: ImageData;
  private readonly width: number;
  private readonly height: number;
  private replacedColor: IRGBA;
  private filledColor: IRGB;

  constructor(imageData: ImageData) {
    this.imageData = imageData;

    this.width = imageData.width;

    this.height = imageData.height;
  }

  public getFloodFilledImageData(point: IPoint, rgb: IRGB): ImageData {
    this.replacedColor = this.getRGBAInPoint(point);
    this.filledColor = rgb;

    return this.calcFloodFilledImageData(point);
  }

  private calcFloodFilledImageData(point: IPoint): ImageData {
    this.floodFill4(point);

    return this.imageData;
  }

  private floodFill4(point: IPoint): void {
    if (!this.isPointWithinImageScope(point)) {  // out of the range of the image
      return;
    }

    const currentColor = this.getRGBAInPoint(point);

    if (!this.isEqualRGBA(currentColor, this.replacedColor)) { // not the same color
      return;
    }

    if (this.isEqualRGB(currentColor, this.filledColor)) { // filled before, skip
      return;
    }

    this.setRGBInPoint(point, this.filledColor);

    this.floodFill4({ x: point.x + 1, y: point.y });
    this.floodFill4({ x: point.x - 1, y: point.y });
    this.floodFill4({ x: point.x, y: point.y + 1 });
    this.floodFill4({ x: point.x, y: point.y - 1 });
  }

  private getRGBAInPoint(point: IPoint): IRGBA {
    const index = this.getImageDataIndexFromPoint(point);
    const { data } = this.imageData;

    return { r: data[index], g: data[index + 1], b: data[index + 2], a: data[index + 3] };
  }

  private setRGBInPoint(point: IPoint, rgb: IRGB): void {
    const index = this.getImageDataIndexFromPoint(point);
    const { data } = this.imageData;

    data[index] = rgb.r;
    data[index + 1] = rgb.g;
    data[index + 2] = rgb.b;
    data[index + 3] = 255;
  }

  private isPointWithinImageScope({ x, y }: IPoint): boolean {
    return x < this.width && y < this.height;
  }

  private isEqualRGB(tested: IRGBA, sample: IRGB): boolean {
    return tested.r === sample.r && tested.g === sample.g &&
      tested.b === sample.b && tested.a === 255;
  }

  private isEqualRGBA(tested: IRGBA, sample: IRGBA): boolean {
    return tested.r === sample.r && tested.g === sample.g &&
      tested.b === sample.b && tested.a === sample.a;
  }

  private getImageDataIndexFromPoint({ x, y }: IPoint): number {
    const indexOfPosition = y * this.width + x;
    const indexInImageData = indexOfPosition * SIZEOF_RGBA;

    return indexInImageData;
  }
}
