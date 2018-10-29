import * as workerPath from "file-loader?name=[name].js!./lightnessData.worker";

export default class Pixelate {
  private readonly lightnessWorker: Worker;

  constructor() {
    this.lightnessWorker = new Worker(workerPath);
  }

  public getComputedImageData(imageData: ImageData, params: object): Promise<ImageData> {
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
