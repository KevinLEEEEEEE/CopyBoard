import { Pipeline } from "../pipieline/pipeline";

interface IOutputPanel {
  updateOutputImage(imageData: ImageData): void;
}

class OutputPanel implements IOutputPanel {
  private readonly pipeline: Pipeline;
  private parentNode: HTMLElement;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;

    this.pipeline = new Pipeline(parentNode);
  }

  public init(imageData: ImageData): void {
    // const pipeline = new Pipeline(this.parentNode);

    // pipeline.init(imageData);

    this.displayOutputPanel();

    this.drawImageDataOnCavas(imageData);
  }

  public updateOutputImage(imageData: ImageData) {
    // this.pipeline.init(imageData);

    this.displayOutputPanel();

    this.drawImageDataOnCavas(imageData);
  }

  private displayOutputPanel(): void {
    const outputPanel = document.getElementById("output");

    outputPanel.classList.add("outputVisible");
  }

  private drawImageDataOnCavas(imageData: ImageData): void {
    const outputCanvas: any = document.getElementById("outputCanvas");
    const ctx: CanvasRenderingContext2D = outputCanvas.getContext("2d");

    ctx.putImageData(imageData, 0, 0);
  }
}

export {
  OutputPanel,
  IOutputPanel,
};
