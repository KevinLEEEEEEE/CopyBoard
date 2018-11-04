import PixelateWorker = require("worker-loader?name=dist/[name].js!./pixelate.worker");
import Logger from "../../utils/log/log";

interface IPixelateInput {
  imageData: ImageData;
  widthPerPixel: number;
  heightPerPixel: number;
}

class Pixelate {
  private readonly pixelateWorker: Worker;
  private readonly logger: Logger;

  constructor() {
    this.pixelateWorker = new PixelateWorker();

    this.logger = new Logger();
  }

  /**
   * the colorData in a pixelSize * pixelSize will be combined
   * @param pixelBlockWidth
   * @param pixelBlockHeight
   */
  public getPixelatedImageData(pixelateInput: IPixelateInput): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      this.pixelateWorker.addEventListener("message", (message) => {
        this.logger.info("run pixelate process successfully");

        resolve(message.data.imageData);
      });

      this.pixelateWorker.addEventListener("error", (err) => {
        reject(err);
      });

      this.pixelateWorker.postMessage(pixelateInput);
    });
  }
}

export {
  Pixelate,
  IPixelateInput,
};
