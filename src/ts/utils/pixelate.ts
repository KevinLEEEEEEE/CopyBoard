import * as workerPath from "file-loader?name=[name].js!./pixelate.worker";

export default class Pixelate {
  private readonly imageData;
  private readonly width: number;
  private readonly height: number;
  private readonly pixelateWorker: Worker;

  constructor(imageData) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
    this.pixelateWorker = new Worker(workerPath);
  }

  /**
   * the colorData in a pixelSize * pixelSize will be combined
   * @param pixelBlockWidth
   * @param pixelBlockHeight
   */
  public getPixelatedImageData(pixelBlockWidth: number = 1, pixelBlockHeight: number = 1): Promise<ImageData> {

    const data = {
      imageData: this.imageData,
      width: this.width,
      height: this.height,
      pixelBlockWidth,
      pixelBlockHeight,
    };

    return new Promise((resolve, reject) => {
      this.pixelateWorker.addEventListener("message", (message) => {
        resolve(message.data.imageData);
      });

      this.pixelateWorker.addEventListener("error", (err) => {
        reject(err);
      });

      this.pixelateWorker.postMessage(data);
    });
  }
}
