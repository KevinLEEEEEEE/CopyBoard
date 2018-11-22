import { Pipeline, pipelineType } from "../pipieline/pipeline";

interface IOutputPanel {
  updateOutputImage(imageData: ImageData, name: string): void;
}

class OutputPanel implements IOutputPanel {
  private readonly pipeline: Pipeline;
  private name: string = "image";

  constructor(parentNode: HTMLElement) {
    this.pipeline = new Pipeline(parentNode);
  }

  public init(): void {
    this.attachBtnEvents();

    this.pipeline.init(this.pipelineUpdate);
  }

  public updateOutputImage(imageData: ImageData, name: string) {
    this.displayOutputPanel();

    this.adjustToParent(imageData.width, imageData.height);

    this.name = name;

    this.pipeline.setImageData(imageData);
  }

  private pipelineUpdate = (imageData) => {
    this.drawImageDataOnCavas(imageData);
  }

  private displayOutputPanel(): void {
    const outputPanel = document.getElementById("output");

    outputPanel.classList.add("outputVisible");
  }

  private drawImageDataOnCavas(imageData: ImageData): void {
    const outputCanvas = document.getElementById("outputCanvas") as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = outputCanvas.getContext("2d");

    ctx.putImageData(imageData, 0, 0);

    this.updateDownloadBtn();
  }

  private attachBtnEvents(): void {
    const lightnessBtn = document.getElementById("lightnessBtn"); // error handler required
    const cancel = document.getElementById("cancel");

    lightnessBtn.addEventListener("click", this.lightnessBtn, false);

    cancel.addEventListener("click", this.cancelDisplay, false);
  }

  private lightnessBtn = (): void => {
    this.pipeline.addComponent(pipelineType.lightness);
  }

  private cancelDisplay = () => {
    const outputPanel = document.getElementById("output");

    outputPanel.classList.remove("outputVisible");
  }

  private adjustToParent(w: number, h: number) {
    const outputCanvas = document.getElementById("outputCanvas") as HTMLCanvasElement;
    const parent = outputCanvas.parentNode as HTMLElement;
    const parentStyle = window.getComputedStyle(parent);

    const pWidth = parseInt(parentStyle.width, 10);
    const pHeight = parseInt(parentStyle.height, 10);
    const pRatio = pWidth / pHeight;
    const ratio = w / h;
    let scale = 1;

    if (pRatio > ratio) {
      scale = pHeight / h;
    } else {
      scale = pWidth / w;
    }

    outputCanvas.width = w;
    outputCanvas.height = h;

    window.requestAnimationFrame(() => {
      outputCanvas.style.width = `${w * scale}px`;
      outputCanvas.style.height = `${h * scale}px`;
    });
  }

  private updateDownloadBtn() {
    const downloadBtn = document.getElementById("download");
    const canvas = document.getElementById("outputCanvas") as HTMLCanvasElement;
    const base64 = canvas.toDataURL("image/jpeg");

    downloadBtn.setAttribute("href", base64);

    downloadBtn.setAttribute("download", this.name + ".jpeg");
  }
}

export {
  OutputPanel,
  IOutputPanel,
};
