import { Pipeline } from "./pipieline/pipeline";

export default class OutputPanel {
  public init(): void {
    const pipeline = document.getElementById("pipeline");
    const i = new Pipeline(pipeline);
    const data = new Uint8ClampedArray([
      0, 0, 0, 0, 1, 1, 1, 1,
      2, 2, 2, 2, 3, 3, 3, 3,
    ]);
    const imageData = new ImageData(data, 2, 2);

    i.init(imageData);
  }
}
