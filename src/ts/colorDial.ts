import { colorDialTemplate, IColorDialTemplate } from "./templates/colorDialTemplate";
import ColorConversion from "./utils/colorConversion";
import Log from "./utils/log/log";

type IRegisterFunc = (hex: string) => void;

const COLORDIAL_NODE_WIDTH = 100;
const COLORDIAL_NODE_HEIGHT = 100;

export default class ColorDial {
  private readonly dialDomsPackage: IColorDialTemplate;
  private readonly colorConversion: ColorConversion;
  private inputEventListeners: IRegisterFunc[] = [];
  private readonly parentNode: HTMLElement;
  private currentColor: string = "#000000";
  private clickOffsetPos: number[] = [0, 0];
  private canMove: boolean = false;
  private logger: Log;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;

    this.dialDomsPackage = colorDialTemplate();

    this.colorConversion = new ColorConversion();

    this.logger = new Log();
  }

  // -----------------------------------------------------------------------------------------

  /**
   * run after instance to attach events and add self to don tree
   */
  public init(): void {
    this.attachMoveEvents();

    this.attachInputEvents();

    this.appendSelfToParentNode();

    this.logger.info("color dial init successfully");
  }

  /**
   * delete all events as well as the node self
   */
  public delete(): void {
    this.removeMoveEvents();

    this.removeInputEvents();

    this.removeSelfFromParentNode();
  }

  /**
   * get current color in an array like [r, g, a]
   */
  public getColor(): number[] {
    return this.colorConversion.hexToRgb(this.currentColor);
  }

  public setRGBColor(r: number, g: number, b: number): void {
    const hex: string = this.colorConversion.rgbToHex(r, g, b);

    this.setHexColor(hex);
  }

  public setHexColor(hex: string) {
    this.currentColor = hex;

    this.updateInputDisplay();

    this.informEventListeners();
  }

  public registerEvents(func: IRegisterFunc): void {
    this.inputEventListeners.push(func);
  }

  private informEventListeners(): void {
    this.inputEventListeners.forEach((listener) => {
      listener(this.currentColor);
    });
  }

  // -----------------------------------------------------------------------------------------

  private appendSelfToParentNode(): void {
    this.parentNode.appendChild(this.dialDomsPackage.colorDial);
  }

  private removeSelfFromParentNode(): void {
    this.parentNode.removeChild(this.dialDomsPackage.colorDial);
  }

  // -----------------------------------------------------------------------------------------

  private attachMoveEvents(): void {
    const colorDial: HTMLElement = this.dialDomsPackage.colorDial;

    colorDial.addEventListener("mousedown", this.mousedown, true);

    colorDial.addEventListener("mousemove", this.mousemove, true);

    colorDial.addEventListener("mouseup", this.mouseup, true);

    colorDial.addEventListener("dragover", this.preventAndStop, true);

    colorDial.addEventListener("drop", this.preventAndStop, true);

    this.parentNode.addEventListener("mousemove", this.mousemove, true);

    this.parentNode.addEventListener("mouseup", this.mouseup, true);
  }

  private removeMoveEvents(): void {
    const colorDial: HTMLElement = this.dialDomsPackage.colorDial;

    colorDial.removeEventListener("mousedown", this.mousedown, true);

    colorDial.removeEventListener("mousemove", this.mousemove, true);

    colorDial.removeEventListener("mouseup", this.mouseup, true);

    colorDial.removeEventListener("dragover", this.preventAndStop, true);

    colorDial.removeEventListener("drop", this.preventAndStop, true);

    this.parentNode.removeEventListener("mousemove", this.mousemove, true);

    this.parentNode.removeEventListener("mouseup", this.mouseup, true);
  }

  private mousedown = (e): void => {
    const { target } = e;

    if (!target.isSameNode(this.dialDomsPackage.colorDial)) {
      return;
    }

    const { offsetX, offsetY } = e;

    this.clickOffsetPos = [offsetX, offsetY];

    this.canMove = true;

    this.activePointerEvents(this.parentNode);
  }

  private mousemove = (e): void => {
    if (this.canMove !== true) {
      return;
    }

    const { pageX, pageY } = e;
    const { clientWidth, clientHeight } = this.parentNode;

    const x: number = this.getRightPosition(pageX, this.clickOffsetPos[0], COLORDIAL_NODE_WIDTH, clientWidth);
    const y: number = this.getRightPosition(pageY, this.clickOffsetPos[1], COLORDIAL_NODE_HEIGHT, clientHeight);

    this.updateNodePosition(this.dialDomsPackage.colorDial , x, y);
  }

  private mouseup = (): void => {
    this.canMove = false;

    this.preventPointerEvents(this.parentNode);
  }

  private preventAndStop(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private preventPointerEvents(node: HTMLElement): void {
    node.classList.add("noPointerEvents");
  }

  private activePointerEvents(node: HTMLElement): void {
    node.classList.remove("noPointerEvents");
  }

  private getRightPosition(toClientDis: number, toNodeDis: number, length: number, conteinerLength): number {
    if (toClientDis - toNodeDis < 0) {
      return 0;
    } else if (toClientDis - toNodeDis + length > conteinerLength) {
      return conteinerLength - length;
    } else {
      return toClientDis - toNodeDis;
    }
  }

  private updateNodePosition(node: HTMLElement, x: number, y: number): void {
    window.requestAnimationFrame(() => {
      node.style.left = x + "px";
      node.style.top = y + "px";
    });
  }

  // -----------------------------------------------------------------------------------------

  private attachInputEvents(): void {
    const { colorInputL, colorInputR } = this.dialDomsPackage;

    colorInputL.addEventListener("change", this.colorInputChange, true);

    colorInputR.addEventListener("change", this.colorInputChange, true);
  }

  private removeInputEvents(): void {
    const { colorInputL, colorInputR } = this.dialDomsPackage;

    colorInputL.removeEventListener("change", this.colorInputChange, true);

    colorInputR.removeEventListener("change", this.colorInputChange, true);
  }

  private colorInputChange = (e): void => {
    const currentColor = e.target.value;

    this.currentColor = currentColor;

    this.updateInputDisplay();

    this.informEventListeners();
  }

  private updateInputDisplay() {
    const { colorInputL, colorInputR } = this.dialDomsPackage;

    colorInputL.value = this.currentColor;
    colorInputR.value = this.currentColor;
  }
}
