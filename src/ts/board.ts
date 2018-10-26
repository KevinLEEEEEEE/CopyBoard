
export default class Board {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private name: string;
  private width: number = 0;
  private height: number = 0;
  private cssWidth: number = 0;
  private cssHeight: number = 0;

  constructor(name: string) {
    this.name = name;

    this.canvas = document.createElement("canvas");

    this.ctx = this.canvas.getContext("2d");
  }

  // -----------------------------------------------------------------------------------------

  public getName(): string {
    return this.name;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getStyleWidth(): number {
    return this.cssWidth;
  }

  public getStyleHeight(): number {
    return this.cssHeight;
  }

  public getImageData(): ImageData {
    return this.ctx.getImageData(0, 0, this.width, this.height);
  }

  // -----------------------------------------------------------------------------------------

  public setName(name: string): void {
    this.name = name;
  }

  public setWidth(width: number) {
    this.width = width;

    this.canvas.width = width;
  }

  public setHeight(height: number) {
    this.height = height;

    this.canvas.height = height;
  }

  public setStyleWidth(width: number) {
    this.cssWidth = width;

    this.canvas.style.width = width + "px";
  }

  public setStyleHeight(height: number) {
    this.cssHeight = height;

    this.canvas.style.height = height + "px";
  }

  public setCanvasParentNode(parentNode: HTMLElement): void {
      parentNode.appendChild(this.canvas);
  }

  // -----------------------------------------------------------------------------------------

  public drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number): void {
    this.ctx.drawImage(image, x, y, width, height);
  }

  public drawImageData(imageData: ImageData) {
    this.ctx.putImageData(imageData, 0, 0);
  }
}
