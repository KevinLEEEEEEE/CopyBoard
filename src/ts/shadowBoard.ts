import Board from "./board";
import { IShadowTemplate, shadowTemplate } from "./templates/shadowTemplate";

const enum shadowMode {
  pen,
  eraser,
}

class ShadowBoard extends Board {
  private readonly shadowDomsPackage: IShadowTemplate;
  private readonly shadowContext: CanvasRenderingContext2D;
  private readonly defaultSize: number[];
  private shadowMode: shadowMode = shadowMode.pen;
  private isShadowModeActive: boolean = false;
  private currentMousePos: number[] = [-1, -1];
  private currentScaleRatio: number;

  constructor(name: string, width: number, height: number, scaleRatio: number) {
    super(name);

    this.defaultSize = [width, height];

    this.currentScaleRatio = scaleRatio;

    this.shadowDomsPackage = shadowTemplate();

    this.shadowContext = this.shadowDomsPackage.shadowBoard.getContext("2d");

    this.updateCanvasSize();

    this.updateCanvasStyleSize();

    this.attachShadowEvents();

    this.shadowContext.strokeStyle = "white";
  }

  // -----------------------------------------------------------------------------------------

  public setCanvasParentNode(parentNode: HTMLElement): void {
    super.setCanvasParentNode(parentNode);

    parentNode.appendChild(this.shadowDomsPackage.shadowBoard);
  }

  public fillContentRect(layerX: number, layerY: number): void {
    const [x, y] = this.getXYFromLayerXY(layerX, layerY);

    super.fillContentRect(x, y, 1, 1);
  }

  public clearContentRect(layerX: number, layerY: number): void {
    const [x, y] = this.getXYFromLayerXY(layerX, layerY);

    super.clearContentRect(x, y, 1, 1);
  }

  // -----------------------------------------------------------------------------------------

  public getCurrentScaleRatio(): number {
    return this.currentScaleRatio;
  }

  public getDefaultSize(): number[] {
    return this.defaultSize;
  }

  public setCurrentScaleRatio(ratio: number) {
    const width = this.defaultSize[0];
    const height = this.defaultSize[1];

    this.currentScaleRatio = ratio;

    this.updateCanvasStyleSize();

    this.updateShadowCanvasSize(width, height);
  }

  public setFillColor(hex: string): void {
    this.shadowContext.fillStyle = hex;

    super.setFillColor(hex);
  }

  public pauseShadowMode(): void {
    this.isShadowModeActive = false;
  }

  public restartShadowMode(): void {
    this.isShadowModeActive = true;
  }

  public changeShadowMode(mode: shadowMode): void {
    this.shadowMode = mode;
  }

  private updateCanvasStyleSize(): void {
    const scaledWidth = this.defaultSize[0] * this.currentScaleRatio;
    const scaledHeight = this.defaultSize[1] * this.currentScaleRatio;

    this.updateContentCanvasStyleSize(scaledWidth, scaledHeight);

    this.updateShadowCanvasStyleSize(scaledWidth, scaledHeight);
  }

  private updateContentCanvasStyleSize(width: number, height: number): void {
    this.setStyleWidth(width);

    this.setStyleHeight(height);
  }

  private updateShadowCanvasStyleSize(width: number, height: number): void {
    const shadowCanvas = this.shadowDomsPackage.shadowBoard;

    window.requestAnimationFrame(() => {
      shadowCanvas.style.width = width + "px";
      shadowCanvas.style.height = height + "px";
    });
  }

  private updateCanvasSize() {
    const width = this.defaultSize[0];
    const height = this.defaultSize[1];

    this.updateContentCanvasSize(width, height);

    this.updateShadowCanvasSize(width, height);
  }

  private updateContentCanvasSize(width: number, height: number): void {
    this.setWidth(width);

    this.setHeight(height);
  }

  private updateShadowCanvasSize(width: number, height: number): void {
    this.shadowDomsPackage.shadowBoard.width = width * this.currentScaleRatio;
    this.shadowDomsPackage.shadowBoard.height = height * this.currentScaleRatio;
  }

  private getXYFromLayerXY(layerX, layerY): number[] {
    const scaleRatio = this.currentScaleRatio;
    const x = Math.floor(layerX / scaleRatio);
    const y = Math.floor(layerY / scaleRatio);

    return [x, y];
  }

  private getScaledXYFromLayerXY(layerX, layerY): number[] {
    const scaleRatio = this.currentScaleRatio;
    const x = Math.floor(layerX / scaleRatio) * scaleRatio;
    const y = Math.floor(layerY / scaleRatio) * scaleRatio;

    return [x, y];
  }

  // -----------------------------------------------------------------------------------------

  private attachShadowEvents(): void {
    const { shadowBoard } = this.shadowDomsPackage;

    shadowBoard.addEventListener("mousemove", this.shadowMove, true);

    shadowBoard.addEventListener("mouseleave", this.shadowLeave, true);
  }

  private shadowMove = (e) => {
    const { layerX, layerY } = e;

    if (this.isShadowModeActive === true) {
      this.paintShadowBlock(layerX, layerY);
    }
  }

  private shadowLeave = () => {
    this.clearShadowLayer();
  }

  private paintShadowBlock(layerX: number, layerY: number): void {
    const [x, y] = this.getScaledXYFromLayerXY(layerX, layerY);

    if (x !== this.currentMousePos[0] || y !== this.currentMousePos[1]) {
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
    this.shadowContext.fillRect(x, y, this.currentScaleRatio, this.currentScaleRatio);
  }

  private fillShadowStroke(x: number, y: number): void {
    const ctx = this.shadowContext;

    ctx.beginPath();
    ctx.rect(x, y, this.currentScaleRatio, this.currentScaleRatio);
    ctx.closePath();
    ctx.stroke();
  }

  private clearShadowLayer() {
    const [width, height] = this.defaultSize;

    this.shadowContext.clearRect(0, 0, width * this.currentScaleRatio, height * this.currentScaleRatio);
  }
}

export {
  ShadowBoard,
  shadowMode,
};
