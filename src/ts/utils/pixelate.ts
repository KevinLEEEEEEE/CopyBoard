export default class Pixelate {
  private readonly imageData;
  private readonly width: number;
  private readonly height: number;

  constructor(imageData) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
  }

  public getPixelatedImageData(pixelSize: number = 1) {
    const loopWidth = this.getWidthLoopTimes(pixelSize);
    const loopHeight = this.getHeightLoopTimes(pixelSize);

    for (let i = 0, j = loopWidth * loopHeight; i < j; i += 1) {
      const [loopX, loopY] = this.get2DCoordinateFrom1DPosition(i, loopWidth);
      const piexlatedData = [];

      for (let a = 0, b = pixelSize * pixelSize; a < b; a += 1) {
        const [blockX, blockY] = this.get2DCoordinateFrom1DPosition(a, pixelSize);
        const x = loopX * pixelSize + blockX;
        const y = loopY * pixelSize + blockY;
        const rgb = this.getRGBInPosition(x, y);

        piexlatedData.push(rgb);
      }

      console.log(piexlatedData);
    }
  }

  private getWidthLoopTimes(pixelWidth: number): number {
    return (this.width / pixelWidth) + (this.width % pixelWidth === 0 ? 0 : 1);
  }

  private getHeightLoopTimes(pixelHeight: number): number {
    return (this.height / pixelHeight) + (this.height % pixelHeight === 0 ? 0 : 1);
  }

  private getRGBInPosition(x: number, y: number): number[] {
    if (x >= this.width || y >= this.height) {
      return [0, 0, 0];
    }

    const indexOfPosition = this.get1DPositionFrom2DCoordinate(x, y);
    const indexInImageData = indexOfPosition; // * 4 later
    const { data } = this.imageData;

    return [data[indexInImageData], data[indexInImageData], data[indexInImageData]]; // +0, +1, +2
  }

  private get2DCoordinateFrom1DPosition(index: number, width: number): number[] {
    const x = index % width;
    const y = Math.floor(index / width);

    return [x, y];
  }

  private get1DPositionFrom2DCoordinate(x: number, y: number): number {
    return y * this.width + x;
  }
}
