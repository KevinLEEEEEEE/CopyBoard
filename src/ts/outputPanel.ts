import { Pipeline } from "./pipieline/pipeline";

export default class OutputPanel {
  private parentNode: HTMLElement;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;
  }

  public init(imageData: ImageData): void {
    const pipeline = new Pipeline(this.parentNode);

    pipeline.init(imageData);

    this.displayOutputPanel();

    this.drawImageDataOnCavas(imageData);
  }

  private displayOutputPanel(): void {
    const outputPanel = document.getElementById("output");

    outputPanel.classList.add("outputDisplay");
  }

  private drawImageDataOnCavas(imageData: ImageData): void {
    const outputCanvas: any = document.getElementById("outputCanvas");
    const ctx: CanvasRenderingContext2D = outputCanvas.getContext("2d");

    ctx.putImageData(imageData, 0, 0);
  }
}
