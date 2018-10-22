
export default class Board {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private name: string;
  private opacity: number = 1;
  private locked: boolean = false;

  constructor(name: string) {
    this.name = name;

    this.canvas = document.createElement("canvas");

    this.ctx = this.canvas.getContext("2d");
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public setWidth(width: number) {
    this.canvas.width = width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  public setHeight(height: number) {
    this.canvas.height = height;
  }

  public getOpacity(): number {
    return this.opacity;
  }

  public setOpacity(opacity: number) {
    this.opacity = opacity;
  }

  public lock(): void {
    this.locked = true;
  }

  public unlock(): void {
    this.locked = false;
  }

  public islocked(): boolean {
    return this.locked;
  }

  public drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number): void {
    this.ctx.drawImage(image, x, y, width, height);
  }
}
