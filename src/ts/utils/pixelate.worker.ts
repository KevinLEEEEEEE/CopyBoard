const SIZEOF_RGBA = 4; // [r, g, b, a]

class PixelBlock {
  private readonly imageData: ImageData;
  private readonly pixelBlockWidth: number;
  private readonly pixelBlockHeight: number;
  private readonly width: number;
  private readonly height: number;

  constructor({ imageData, pixelBlockWidth, pixelBlockHeight, width, height }) {
    this.imageData = imageData;
    this.pixelBlockWidth = pixelBlockWidth;
    this.pixelBlockHeight = pixelBlockHeight;
    this.width = width;
    this.height = height;
  }

  public getBlockAmountInXDir(): number {
    return Math.ceil(this.width / this.pixelBlockWidth);
  }

  public getTotalBlockAmount(): number {
    return this.getBlockAmountInXDir() * this.getBlockAmountInYDir();
  }

  public transIndexToCoordinateOfImageData(index: number): number[] {
    const x = index % this.getBlockAmountInXDir();
    const y = Math.floor(index / this.getBlockAmountInXDir());

    return [x, y];
  }

  public transIndexToCoordinateOfPixelBlock(index: number): number[] {
    const x = index % this.pixelBlockWidth;
    const y = Math.floor(index / this.pixelBlockWidth);

    return [x, y];
  }

  public getRGBInPosition(x: number, y: number) {
    if (x >= this.width || y >= this.height) {
      return [];
    }

    const indexOfPosition =  y * this.width + x;
    const indexInImageData = indexOfPosition * SIZEOF_RGBA;
    const { data } = this.imageData;

    return [data[indexInImageData], data[indexInImageData + 1], data[indexInImageData + 2]];
  }

  public setRGBInPosition(x: number, y: number, rgb: number[]): void {
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

  public sumUpAndComputeAverage(piexlatedData: number[]): number[] {
    const combinedData = piexlatedData.reduce((prev, current) => {
      return prev.map((prevValue, index) => prevValue + current[index]);
    }, [0, 0, 0]);

    return combinedData.map((data) => data / piexlatedData.length);
  }

  public getImageData(): ImageData {
    return this.imageData;
  }

  private getBlockAmountInYDir(): number {
    return Math.ceil(this.height / this.pixelBlockHeight);
  }
}

onmessage = (event) => {
  const { pixelBlockWidth, pixelBlockHeight } = event.data;
  const pixelBlock = new PixelBlock(event.data);

  const totalBlockAmount = pixelBlock.getTotalBlockAmount();
  const pixelBlockSize = pixelBlockWidth * pixelBlockHeight;

  for (let i = 0, j = totalBlockAmount; i < j; i += 1) {
    const [blockIndexInXDir, blockIndexInYDir] = pixelBlock.transIndexToCoordinateOfImageData(i);
    const colorDataOfPixelBlock = [];

    for (let a = 0, b = pixelBlockSize; a < b; a += 1) {
      const [XPosInBlock, YPosInBlock] = pixelBlock.transIndexToCoordinateOfPixelBlock(a);
      const x = blockIndexInXDir * pixelBlockWidth + XPosInBlock;
      const y = blockIndexInYDir * pixelBlockHeight + YPosInBlock;
      const rgb = pixelBlock.getRGBInPosition(x, y);

      if (rgb !== []) {
        colorDataOfPixelBlock.push(rgb);
      }
    }

    const combinedColorData = pixelBlock.sumUpAndComputeAverage(colorDataOfPixelBlock);

    for (let a = 0, b = pixelBlockSize; a < b; a += 1) {
      const [XPosInBlock, YPosInBlock] = pixelBlock.transIndexToCoordinateOfPixelBlock(a);
      const x = blockIndexInXDir * pixelBlockWidth + XPosInBlock;
      const y = blockIndexInYDir * pixelBlockHeight + YPosInBlock;

      pixelBlock.setRGBInPosition(x, y, combinedColorData);
    }
  }

  postMessage({
    imageData: pixelBlock.getImageData(),
  });
};
