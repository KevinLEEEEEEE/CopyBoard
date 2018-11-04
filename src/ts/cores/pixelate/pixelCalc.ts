import { IPixelateInput } from "./pixelate";

const SIZEOF_RGBA = 4; // [r, g, b, a]

interface IPoint {
  x: number;
  y: number;
}

interface IPixelBlock {
  width: number;
  height: number;
  size: number;
}

interface IBlockAmount {
  x: number;
  y: number;
  total: number;
}

export default class PixelCalc {
  private readonly imageData: ImageData;
  private readonly width: number;
  private readonly height: number;
  private blockAmount: IBlockAmount;
  private pixelBlock: IPixelBlock;

  constructor({ imageData, widthPerPixel, heightPerPixel }: IPixelateInput) {
    this.imageData = imageData;

    this.width = imageData.width;

    this.height = imageData.height;

    this.initPixelData(widthPerPixel, heightPerPixel);
  }

  public calcPixelatedImageData(): ImageData {
    const { total: blockAmountTotal } = this.blockAmount;
    const { size: pixelBlockSize } = this.pixelBlock;

    for (let indexOfBlock = 0; indexOfBlock < blockAmountTotal; indexOfBlock += 1) {
      const colorDataInPixelBlock = [];
      const pointsInPixelBlock = [];

      for (let indexInBlock = 0; indexInBlock < pixelBlockSize; indexInBlock += 1) {
        const point = this.getPointByBlockIndex(indexOfBlock, indexInBlock);
        const rgb = this.getRGBInPoint(point);

        if (rgb.length !== 0) {
          colorDataInPixelBlock.push(rgb);
          pointsInPixelBlock.push(point);
        }
      }

      const combinedColorData = this.computeArrayAverage(colorDataInPixelBlock);

      pointsInPixelBlock.forEach((point) => {
        this.setRGBInPoint(point, combinedColorData);
      });
    }

    return this.imageData;
  }

  private initPixelData(widthPerPixel: number, heightPerPixel: number) {
    const pixelBlockWidth = this.validatePixelSize(widthPerPixel);
    const pixelBlockHeight = this.validatePixelSize(heightPerPixel);
    const pixelBlockSize = pixelBlockWidth * pixelBlockHeight;

    this.pixelBlock = {
      width: pixelBlockWidth,
      height: pixelBlockHeight,
      size: pixelBlockSize,
    };

    const blockAmountInXDir = Math.ceil(this.width / this.pixelBlock.width);
    const blockAmountInYDir = Math.ceil(this.height / this.pixelBlock.height);
    const blockAmountTotal = blockAmountInXDir * blockAmountInYDir;

    this.blockAmount = {
      x: blockAmountInXDir,
      y: blockAmountInYDir,
      total: blockAmountTotal,
    };
  }

  private validatePixelSize(pixelSize: number): number {
    pixelSize = pixelSize < 1 ? 1 : pixelSize;

    return Math.round(pixelSize);
  }

  private getPointByBlockIndex(indexOfPixelBlock: number, indexInPixelBlock: number): IPoint {
    const { x: XOfBlock, y: YOfBlock } = this.transIndexToCoordinate(indexOfPixelBlock, this.blockAmount.x);
    const { x: XInBlock, y: YInBlock } = this.transIndexToCoordinate(indexInPixelBlock, this.pixelBlock.width);
    const overallX = XOfBlock * this.pixelBlock.width + XInBlock;
    const overallY = YOfBlock * this.pixelBlock.height + YInBlock;

    return { x: overallX, y: overallY };
  }

  private getRGBInPoint(point: IPoint): number[] {
    if (!this.isPointWithinImageScope(point)) {
      return [];
    }

    const index = this.getImageDataIndexFromPoint(point);
    const { data } = this.imageData;

    return [data[index], data[index + 1], data[index + 2]];
  }

  private setRGBInPoint(point: IPoint, rgb: number[]): void {
    if (!this.isPointWithinImageScope(point)) {
      return;
    }

    const index = this.getImageDataIndexFromPoint(point);
    const { data } = this.imageData;

    [data[index], data[index + 1], data[index + 2]] = rgb;
  }

  private isPointWithinImageScope({ x, y }: IPoint): boolean {
    return x < this.width && y < this.height;
  }

  private getImageDataIndexFromPoint({ x, y }: IPoint): number {
    const indexOfPosition = y * this.width + x;
    const indexInImageData = indexOfPosition * SIZEOF_RGBA;

    return indexInImageData;
  }

  private transIndexToCoordinate(index: number, width: number): IPoint {
    const x = index % width;
    const y = Math.floor(index / width);

    return { x, y };
  }

  private computeArrayAverage(array: number[]): number[] {
    const combinedArray = array.reduce((prev, current) => {
      return prev.map((prevValue, index) => prevValue + current[index]);
    }, [0, 0, 0]);

    const averageArray = combinedArray.map((data) => data / array.length);

    return averageArray;
  }
}
