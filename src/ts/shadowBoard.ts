import Board from "./board";
import { IShadowTemplate, shadowTemplate } from "./templates/shadowTemplate";

const enum shadowMode {
  pen,
  eraser,
}

class ShadowBoard extends Board {
  private readonly shadowDomsPackage: IShadowTemplate;
  private readonly shadowContext: CanvasRenderingContext2D;
  private shadowMode: shadowMode = shadowMode.pen;
  private isActive: boolean = false;
  private currentPos: number[] = [-1, -1];

  constructor(name: string) {
    super(name);

    this.shadowDomsPackage = shadowTemplate();

    this.shadowContext = this.shadowDomsPackage.shadowBoard.getContext("2d");

    this.shadowDomsPackage.shadowBoard.width = 400;
    this.shadowDomsPackage.shadowBoard.height = 300;

    this.attachShadowEvents();
  }

  public setCanvasParentNode(parentNode: HTMLElement): void {
    super.setCanvasParentNode(parentNode);

    parentNode.appendChild(this.shadowDomsPackage.shadowBoard);
  }

  public getCurrentScaleRatio(): number {
    return this.getStyleWidth() / this.getWidth();
  }

  public pauseShadowBoard(): void {
    this.isActive = false;
  }

  public restartShadowBoard(): void {
    this.isActive = true;
  }

  public changeShadowMode(mode: shadowMode): void {
    this.shadowMode = mode;
  }

  private attachShadowEvents(): void {
    const { shadowBoard } = this.shadowDomsPackage;

    shadowBoard.addEventListener("mousemove", this.shadowMove, true);

    shadowBoard.addEventListener("mouseleave", this.shadowLeave, true);
  }

  private shadowMove = (e) => {
    const { layerX, layerY } = e;

    if (this.isActive === true) {
      this.displayShadowBlock(layerX, layerY);
    }
  }

  private shadowLeave = () => {
    this.clearShadowLayer();
  }

  private displayShadowBlock(layerX: number, layerY: number): void {
    const scaleRatio = this.getCurrentScaleRatio();
    const x = Math.floor(layerX / scaleRatio) * scaleRatio;
    const y = Math.floor(layerY / scaleRatio) * scaleRatio;

    if (x !== this.currentPos[0] || y !== this.currentPos[1]) {
      this.drawShadowPixel(x, y);
    }
  }

  private drawShadowPixel(x: number, y: number): void {
    this.clearShadowLayer();

    switch (this.shadowMode) {
      case shadowMode.pen:
      this.fillShadowRect(x, y);
      break;
      case shadowMode.eraser:
      this.fillShadowStroke(x, y);
      break;
      default:
    }
  }

  private fillShadowRect(x: number, y: number): void {
    this.shadowContext.fillRect(x, y, 10, 10);
  }

  private fillShadowStroke(x: number, y: number): void {
    const ctx = this.shadowContext;

    ctx.beginPath();
    ctx.rect(x, y, 10, 10);
    ctx.closePath();
    ctx.stroke();
  }

  private clearShadowLayer() {
    this.shadowContext.clearRect(0, 0, 400, 300);
  }
}

export {
  ShadowBoard,
  shadowMode,
};
