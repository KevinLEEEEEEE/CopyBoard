
export default class Board {
  private name: string;
  private width: number;
  private height: number;
  private opacity: number;
  private locked: boolean;

  constructor() {
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(width: number) {
    this.width = width;
  }

  getHeight(): number {
    return this.height;
  }

  setHeight(height: number) {
    this.height = height;
  }

  getOpacity(): number {
    return this.opacity;
  }

  setOpacity(opacity: number) {
    this.opacity = opacity;
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  islocked(): boolean {
    return this.locked;
  }
}