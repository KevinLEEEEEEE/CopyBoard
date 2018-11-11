import { componentsType, Pipeline } from "./pipeline";

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

  public init(): void {
    this.attachBtnEvents();
  }

  public updateOutputImage(imageData: ImageData) {
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

  private attachBtnEvents(): void {
    const lightnessBtn = document.getElementById("lightnessBtn"); // error handler required

    lightnessBtn.addEventListener("click", this.lightnessBtn, true);
  }

  private lightnessBtn = (): void => {
    this.addComponent(componentsType.brightness);
  }

  private addComponent(type: componentsType): void {
    switch (type) {
      case componentsType.brightness:
    }
  }
}

export {
  OutputPanel,
  IOutputPanel,
};
