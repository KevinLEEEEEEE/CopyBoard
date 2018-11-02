
export default class Board {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
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

  public getColorAt(x: number, y: number): number[] {
    const ratio = this.cssWidth / this.width;
    const scaledX = Math.round(x / ratio);
    const scaledY = Math.round(y / ratio);
    const index = (scaledY * this.width + scaledX) * 4;
    const imageData = this.getImageData();
    const { data } = imageData;

    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  }

  // -----------------------------------------------------------------------------------------

  public setName(name: string): void {
    this.name = name;
  }

  public setWidth(width: number): void {
    this.width = width;

    this.canvas.width = width;
  }

  public setHeight(height: number): void {
    this.height = height;

    this.canvas.height = height;
  }

  public setStyleWidth(width: number): void {
    this.cssWidth = width;

    window.requestAnimationFrame(() => {
      this.canvas.style.width = width + "px";
    });
  }

  public setStyleHeight(height: number): void {
    this.cssHeight = height;

    window.requestAnimationFrame(() => {
      this.canvas.style.height = height + "px";
    });
  }

  public setFillColor(hex: string): void {
    this.ctx.fillStyle = hex;
  }

  public setCanvasParentNode(parentNode: HTMLElement): void {
    parentNode.appendChild(this.canvas);
  }

  // -----------------------------------------------------------------------------------------

  public drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number): void {
    this.ctx.drawImage(image, x, y, width, height);
  }

  public drawImageData(imageData: ImageData): void {
    this.ctx.putImageData(imageData, 0, 0);
  }

  public fillContentRect(x: number, y: number, width: number, height: number): void {
    this.ctx.fillRect(x, y, width, height);
  }

  public clearContentRect(x: number, y: number, width: number, height: number): void {
    this.ctx.clearRect(x, y, width, height);
  }

  public clearContentLayer(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
