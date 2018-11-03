import PixelateWorker = require("worker-loader?name=dist/[name].js!./pixelate.worker");
import Logger from "../../utils/log/log";

export default class Pixelate {
  private readonly pixelateWorker: Worker;
  private readonly imageData;
  private readonly logger: Logger;

  constructor(imageData: ImageData) {
    this.pixelateWorker = new PixelateWorker();

    this.imageData = imageData;

    this.logger = new Logger();
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

    return new Promise((resolve, reject) => {
      this.pixelateWorker.addEventListener("message", (message) => {
        this.logger.info("run pixelate process successfully");

        resolve(message.data.imageData);
      });

      this.pixelateWorker.addEventListener("error", (err) => {
        reject(err);
      });

      this.pixelateWorker.postMessage(data);
    })
    .catch((err) => {
      this.logger.error("error with pixelate process, return original imageData", err);

      return this.imageData;
    });
  }
}
