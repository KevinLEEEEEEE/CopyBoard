import { Pipeline } from "./pipieline/pipeline";

export default class OutputPanel {
  private parentNode: HTMLElement;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;
  }

  public init(): void {
    const i = new Pipeline(this.parentNode);
    const data = new Uint8ClampedArray([
      0, 0, 0, 0, 1, 1, 1, 1,
      2, 2, 2, 2, 3, 3, 3, 3,
    ]);
    const imageData = new ImageData(data, 2, 2);

    i.init(imageData);
  }
}
