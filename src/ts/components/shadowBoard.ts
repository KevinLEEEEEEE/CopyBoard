import { Hex } from "../cores/color/hex";
import FloodFill from "../cores/floodFill/floodFill";
import Board from "./board";
import { IShadowTemplate, shadowTemplate } from "./templates/shadowTemplate";

const enum shadowMode {
  pen,
  eraser,
  bucket,
}

class ShadowBoard extends Board {
  private readonly shadowDomsPackage: IShadowTemplate;
  private readonly shadowContext: CanvasRenderingContext2D;
  private shadowMode: shadowMode = shadowMode.pen;
  private isShadowModeActive: boolean = false;
  private currentFillStyle: Hex = new Hex({ hex: "#000000" });
  private currentMousePos: number[] = [-1, -1];
  private currentScaleRatio: number;

  constructor(name: string, width: number, height: number, scaleRatio: number) {
    super(name);

    this.shadowDomsPackage = shadowTemplate();

    this.shadowContext = this.shadowDomsPackage.shadowBoard.getContext("2d");

    this.initCanvasSize(width, height, scaleRatio);

    this.initShadowCanvasStyle();

    this.attachShadowEvents();
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

  public fillContentBucket(layerX: number, layerY: number): void {
    const [x, y] = this.getXYFromLayerXY(layerX, layerY);
    const rgb = this.currentFillStyle.getRGB();
    const imageData = this.getImageData();

    const floodFillInstance = new FloodFill(imageData);
    const floodFilledImageData = floodFillInstance.getFloodFilledImageData({ x, y }, rgb);

    this.drawImageData(floodFilledImageData);
  }

  public clearContentRect(layerX: number, layerY: number): void {
    const [x, y] = this.getXYFromLayerXY(layerX, layerY);

    super.clearContentRect(x, y, 1, 1);
  }

  public setFillColor(hex: string): void {
    this.shadowContext.fillStyle = hex;

    this.currentFillStyle = new Hex({ hex });

    super.setFillColor(hex);
  }

  public setStyleHeight(height: number): void {
    this.shadowDomsPackage.shadowBoard.height = height;

    super.setStyleHeight(height);

    this.updateCurrentScaleRatio();
  }

  public setStyleWidth(width: number): void {
    this.shadowDomsPackage.shadowBoard.width = width;

    super.setStyleWidth(width);

    this.updateCurrentScaleRatio();
  }

  // -----------------------------------------------------------------------------------------

  public pauseShadowMode(): void {
    this.isShadowModeActive = false;
  }

  public restartShadowMode(): void {
    this.isShadowModeActive = true;
  }

  public changeShadowMode(mode: shadowMode): void {
    this.shadowMode = mode;
  }

  private initShadowCanvasStyle(): void {
    this.shadowContext.strokeStyle = "white";
  }

  private initCanvasSize(width: number, height: number, scaleRatio: number): void {
    super.setWidth(width);

    super.setHeight(height);

    this.setStyleWidth(width * scaleRatio);

    this.setStyleHeight(height * scaleRatio);
  }

  private updateCurrentScaleRatio(): void {
    this.currentScaleRatio = this.getStyleWidth() / this.getWidth();
  }

  private getScaledXYFromLayerXY(layerX, layerY): number[] {
    const scaleRatio = this.currentScaleRatio;
    const x = Math.floor(layerX / scaleRatio) * scaleRatio;
    const y = Math.floor(layerY / scaleRatio) * scaleRatio;

    return [x, y];
  }

  private getXYFromLayerXY(layerX, layerY): number[] {
    const scaleRatio = this.currentScaleRatio;
    const x = Math.floor(layerX / scaleRatio);
    const y = Math.floor(layerY / scaleRatio);

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
    const width = this.getStyleWidth();
    const height = this.getStyleHeight();

    this.shadowContext.clearRect(0, 0, width, height);
  }
}

export {
  ShadowBoard,
  shadowMode,
};
