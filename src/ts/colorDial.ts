import { colorDialTemplate, IColorDialTemplate } from "./templates/colorDialTemplate";
import ColorConversion from "./utils/colorConversion";

export default class ColorDial {
  private readonly parentNode: HTMLElement;
  private readonly dial: IColorDialTemplate;
  private readonly body: HTMLElement;
  private readonly colorConversion: ColorConversion;
  private currentColor: string = "#000000";
  private clickPos: number[] = [0, 0];
  private canMove: boolean = false;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;

    this.body = document.getElementById("main");

    this.dial = colorDialTemplate();

    this.colorConversion = new ColorConversion();

    this.mousedown = this.mousedown.bind(this);

    this.mousemove = this.mousemove.bind(this);

    this.mouseup = this.mouseup.bind(this);
  }

  public init(): void {
    this.attachMoveEvents();

    this.attachInputEvents();

    const { firstChild } = this.parentNode;

    this.parentNode.insertBefore(this.dial.colorDial, firstChild);
  }

  public delete(): void {
    this.removeMoveEvents();

    this.removeInputEvents();

    this.parentNode.removeChild(this.dial.colorDial);
  }

  public getColor(): number[] {
    return this.colorConversion.hexToRgb(this.currentColor);
  }

  public setRGBColor(r: number, g: number, b: number): void {
    const hex: string = this.colorConversion.rgbToHex(r, g, b);

    this.setHexColor(hex);
  }

  public setHexColor(hex: string): void {
    this.currentColor = hex;

    this.updateDisplay();
  }

  private attachMoveEvents(): void {
    const colorDial: HTMLElement = this.dial.colorDial;

    colorDial.addEventListener("mousedown", this.mousedown);

    colorDial.addEventListener("mousemove", this.mousemove);

    colorDial.addEventListener("mouseup", this.mouseup);

    colorDial.addEventListener("dragover", this.preventAll);

    colorDial.addEventListener("drop", this.preventAll);

    this.body.addEventListener("mousemove", this.mousemove);

    this.body.addEventListener("mouseup", this.mouseup);
  }

  private removeMoveEvents(): void {
    const colorDial: HTMLElement = this.dial.colorDial;

    colorDial.removeEventListener("mousedown", this.mousedown);

    colorDial.removeEventListener("mousemove", this.mousemove);

    colorDial.removeEventListener("mouseup", this.mouseup);

    colorDial.removeEventListener("dragover", this.preventAll);

    colorDial.removeEventListener("drop", this.preventAll);

    this.body.removeEventListener("mousemove", this.mousemove);

    this.body.removeEventListener("mouseup", this.mouseup);
  }

  private mousedown(e): void {
    const { target } = e;

    if (!target.isSameNode(this.dial.colorDial)) {
      return;
    }

    const { offsetX, offsetY } = e;

    this.clickPos = [offsetX, offsetY];

    this.canMove = true;
  }

  private mousemove(e): void {
    if (this.canMove !== true) {
      return;
    }

    const { pageX, pageY } = e;
    const [x, y]: number[] = [pageX - this.clickPos[0], pageY - this.clickPos[1]];

    this.updatePosition(x, y);
  }

  private mouseup(): void {
    this.canMove = false;
  }

  private preventAll(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private updatePosition(x: number, y: number): void {
    window.requestAnimationFrame(() => {
      this.dial.colorDial.style.left = x + "px";
      this.dial.colorDial.style.top = y + "px";
    });
  }

  private attachInputEvents(): void {
    const { colorInputL, colorInputR } = this.dial;

    colorInputL.addEventListener("change", (e) => { this.colorChange(e); });

    colorInputR.addEventListener("change", (e) => { this.colorChange(e); });
  }

  private removeInputEvents(): void {
    const { colorInputL, colorInputR } = this.dial;

    colorInputL.removeEventListener("change", (e) => { this.colorChange(e); });

    colorInputR.removeEventListener("change", (e) => { this.colorChange(e); });
  }

  private colorChange(e): void {
    const currentColor = e.target.value;

    this.currentColor = currentColor;

    this.updateDisplay();
  }

  private updateDisplay() {
    const { colorInputL, colorInputR } = this.dial;

    colorInputL.value = this.currentColor;
    colorInputR.value = this.currentColor;
  }
}
