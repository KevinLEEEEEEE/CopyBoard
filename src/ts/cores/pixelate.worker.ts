const SIZEOF_RGBA = 4; // [r, g, b, a]

class PixelBlock {
  public readonly imageData: ImageData;
  private readonly pixelBlockWidth: number;
  private readonly pixelBlockHeight: number;
  private readonly blockAmountInXDir: number;
  private readonly blockAmountInYDir: number;
  private readonly width: number;
  private readonly height: number;

  constructor({ imageData, pixelBlockWidth, pixelBlockHeight }) {
    this.imageData = imageData;
    this.pixelBlockWidth = pixelBlockWidth;
    this.pixelBlockHeight = pixelBlockHeight;
    this.width = imageData.width;
    this.height = imageData.height;
    this.blockAmountInXDir = this.getBlockAmountInXDir();
    this.blockAmountInYDir = this.getBlockAmountInYDir();
  }

  // the amount of pixel block splitted from imageData
  public getPixelBlockAmount(): number {
    return this.blockAmountInXDir * this.blockAmountInYDir;
  }

  // the real pixel amount in single pixel block
  public getPixelBlockSize(): number {
    return this.pixelBlockWidth * this.pixelBlockHeight;
  }

  public getPointByBlockIndex(indexOfPixelBlock: number, indexInPixelBlock): number[] {
    const [XOfBlock, YOfBlock] = this.transIndexToCoordinate(indexOfPixelBlock, this.blockAmountInXDir);
    const [XInBlock, YInBlock] = this.transIndexToCoordinate(indexInPixelBlock, this.pixelBlockWidth);
    const overallX = XOfBlock * this.pixelBlockWidth + XInBlock;
    const overallY = YOfBlock * this.pixelBlockHeight + YInBlock;

    return [overallX, overallY];
  }

  public getRGBInPoint(x: number, y: number): number[] {
    if (x >= this.width || y >= this.height) {
      return [];
    }

    const indexOfPosition =  y * this.width + x;
    const indexInImageData = indexOfPosition * SIZEOF_RGBA;
    const { data } = this.imageData;

    return [data[indexInImageData], data[indexInImageData + 1], data[indexInImageData + 2]];
  }

  public setRGBInPoint(x: number, y: number, rgb: number[]): void {
    if (x >= this.width || y >= this.height) {
      return;
    }

    const indexOfPosition = y * this.width + x;
    const indexInImageData = indexOfPosition * SIZEOF_RGBA;
    const { data } = this.imageData;

    data[indexInImageData] = rgb[0];
    data[indexInImageData + 1] = rgb[1];
    data[indexInImageData + 2] = rgb[2];
  }

  private getBlockAmountInXDir(): number {
    return Math.ceil(this.width / this.pixelBlockWidth);
  }

  private getBlockAmountInYDir(): number {
    return Math.ceil(this.height / this.pixelBlockHeight);
  }

  private transIndexToCoordinate(index: number, width: number): number[] {
    const x = index % width;
    const y = Math.floor(index / width);

    return [x, y];
  }
}

const isArrayEqual = (array1: any[], array2: any[]): boolean => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0, j = array1.length; i < j; i += 1) {
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (!array1[i].equals(array2[i])) {
        return false;
      }
    }

    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};

const computeArrayAverage = (array: number[]): number[] => {
  const combinedArray = array.reduce((prev, current) => {
    return prev.map((prevValue, index) => prevValue + current[index]);
  }, [0, 0, 0]);

  const averageArray = combinedArray.map((data) => data / array.length);

  return averageArray;
};

onmessage = (event) => {
  const pixelBlock = new PixelBlock(event.data);
  const pixelBlockAmount = pixelBlock.getPixelBlockAmount();
  const pixelBlockSize = pixelBlock.getPixelBlockSize();

  for (let indexOfBlock = 0; indexOfBlock < pixelBlockAmount; indexOfBlock += 1) {
    const colorDataInPixelBlock = [];
    const pointsInPixelBlock = [];

    for (let indexInBlock = 0; indexInBlock < pixelBlockSize; indexInBlock += 1) {
      const [x, y] = pixelBlock.getPointByBlockIndex(indexOfBlock, indexInBlock);
      const rgb = pixelBlock.getRGBInPoint(x, y);

      if (!isArrayEqual(rgb, [])) {
        colorDataInPixelBlock.push(rgb);
        pointsInPixelBlock.push([x, y]);
      }
    }

    const combinedColorData = computeArrayAverage(colorDataInPixelBlock);

    pointsInPixelBlock.forEach((point) => {
      pixelBlock.setRGBInPoint(point[0], point[1], combinedColorData);
    });
  }

  postMessage({
    imageData: pixelBlock.imageData,
  });
};
