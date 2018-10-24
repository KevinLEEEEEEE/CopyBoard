const SIZEOF_RGBA = 4; // [r, g, b, a]

export default class Pixelate {
  private readonly imageData;
  private readonly width: number;
  private readonly height: number;

  constructor(imageData) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
  }

  /**
   * the colorData in a pixelSize * pixelSize will be combined
   * @param pixelSize 
   */
  public getPixelatedImageData(pixelBlockWidth: number = 1, pixelBlockHeight: number = 1) {
    const loopWidth = this.getWidthLoopTimes(pixelBlockWidth);
    const loopHeight = this.getHeightLoopTimes(pixelBlockHeight);
    const pixelBlockSize = pixelBlockWidth * pixelBlockHeight;

    for (let i = 0, j = loopWidth * loopHeight; i < j; i += 1) {
      const [loopX, loopY] = this.get2DCoordinateFrom1DPosition(i, loopWidth);
      const piexlatedData = [];

      for (let a = 0, b = pixelBlockSize; a < b; a += 1) {
        const [blockX, blockY] = this.get2DCoordinateFrom1DPosition(a, pixelBlockWidth);
        const x = loopX * pixelBlockWidth + blockX;
        const y = loopY * pixelBlockHeight + blockY;
        const rgb = this.getRGBInPosition(x, y);

        piexlatedData.push(rgb);
      }

      const combinedColorData = this.sumUpAllColorData(piexlatedData, pixelBlockSize);

      console.log(combinedColorData);
    }
  }

  private getBlockAmount(totalLength: number, pixelBlockLength: number): number {
    if (this.hasInCompleteBlock(totalLength, pixelBlockLength)) {
      return this.width / pixelBlockLength + 1;
    }
    return this.width / pixelBlockLength;
  }

  private hasInCompleteBlock(totalLength: number, blockLength: number): boolean {
    return totalLength % blockLength === 0;
  }

  // private getWidthLoopTimes(pixelWidth: number): number {
  //   return (this.width / pixelWidth) + (this.width % pixelWidth === 0 ? 0 : 1);
  // }

  // private getHeightLoopTimes(pixelHeight: number): number {
  //   return (this.height / pixelHeight) + (this.height % pixelHeight === 0 ? 0 : 1);
  // }

  private getRGBInPosition(x: number, y: number): number[] {
    if (x >= this.width || y >= this.height) {
      return [0, 0, 0];
    }

    const indexOfPosition = this.get1DPositionFrom2DCoordinate(x, y, this.width);
    const indexInImageData = indexOfPosition * SIZEOF_RGBA;
    const { data } = this.imageData;

    return [data[indexInImageData], data[indexInImageData + 1], data[indexInImageData + 2]];
  }

  private get2DCoordinateFrom1DPosition(index: number, width: number): number[] {
    const x = index % width;
    const y = Math.floor(index / width);

    return [x, y];
  }

  private get1DPositionFrom2DCoordinate(x: number, y: number, width: number): number {
    return y * width + x;
  }

  private sumUpAllColorData(piexlatedData: number[], pixelBlockSize: number): number[] {
    const combinedData = piexlatedData.reduce((prev, current) => {
      return prev.map((prevValue, index) => prevValue + current[index]);
    }, [0, 0, 0]);

    return combinedData.map((data) => data / pixelBlockSize);
  }
}
