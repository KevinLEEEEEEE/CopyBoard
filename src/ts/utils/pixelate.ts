export default class Pixelate {
  private readonly imageData: ImageData;

  constructor(imageData: ImageData) {
    this.imageData = imageData;
  }

  public getPixelatedImageData(pixelSize: number = 1) {
    console.log(this.imageData);
  }
}
