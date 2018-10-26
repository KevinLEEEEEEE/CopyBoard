import * as workerPath from "file-loader?name=[name].js!./pixelate.worker";
import Log from "../utils/log/log";

export default class Pixelate {
  private readonly imageData;
  private readonly pixelateWorker: Worker;

  constructor(imageData) {
    this.imageData = imageData;
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
      pixelBlockWidth,
      pixelBlockHeight,
    };
    const logger  = new Log();

    return new Promise((resolve, reject) => {
      this.pixelateWorker.addEventListener("message", (message) => {
        logger.info("run pixelate process successfully");

        resolve(message.data.imageData);
      });

      this.pixelateWorker.addEventListener("error", (err) => {
        reject(err);
      });

      this.pixelateWorker.postMessage(data);
    })
    .catch((err) => {
      logger.error("error with pixelate process, return original imageData", err);

      return this.imageData;
    });
  }
}
