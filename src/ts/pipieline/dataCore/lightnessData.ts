import * as workerPath from "file-loader?name=[name].js!./lightnessData.worker";
import DataCore from "../domCore/component/dataCore";
import { ILightnessParams } from "./paramsInterface/paramsInterface";

const defaultParams: ILightnessParams = {
  lightness: 0,
};

export default class Pixelate extends DataCore {
  private readonly lightnessWorker: Worker;

  constructor() {
    super();

    this.lightnessWorker = new Worker(workerPath);
  }

  public getComputedImageData(imageData: ImageData, params: ILightnessParams = defaultParams): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      this.lightnessWorker.addEventListener("message", (message) => {
        resolve(message.data);
      });

      this.lightnessWorker.addEventListener("error", (err) => {
        reject(err);
      });

      this.lightnessWorker.postMessage({ imageData, params });
    });
  }
}
