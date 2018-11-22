import * as workerPath from "file-loader?name=[name].js!./saturationData.worker";
import DataCore from "../domCore/component/dataCore";
import { ISaturationParams } from "./paramsInterface/paramsInterface";

const defaultParams: ISaturationParams = {
  value: 0,
};

export default class Pixelate extends DataCore {
  private readonly saturationWorker: Worker;

  constructor() {
    super();

    this.saturationWorker = new Worker(workerPath);
  }

  public getComputedImageData(imageData: ImageData, params: ISaturationParams = defaultParams): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      this.saturationWorker.addEventListener("message", (message) => {
        resolve(message.data);
      });

      this.saturationWorker.addEventListener("error", (err) => {
        reject(err);
      });

      this.saturationWorker.postMessage({ imageData, params });
    });
  }
}
