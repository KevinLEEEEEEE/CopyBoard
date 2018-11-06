import Color from "../cores/color/color";
import { Hex, IHex } from "../cores/color/hex";
import { IRGB } from "../cores/color/rgb";
import Subject from "../cores/observer/subject";
import Log from "../utils/log/log";
import { colorDialTemplate, IColorDialTemplate } from "./templates/colorDialTemplate";

const enum STATE {
  default,
  move,
}

interface IColorDial {
  changeColor(color: Color): void;
  getRGB(): IRGB;
  getHex(): IHex;
}

interface IWindowSize {
  innerWidth: number;
  innerHeight: number;
}

interface IMouseOffsetPosition {
  offsetX: number;
  offsetY: number;
}

interface INodePosition {
  x: number;
  y: number;
}

class ColorDial extends Subject implements IColorDial {
  private readonly dialDomsPackage: IColorDialTemplate;
  private readonly parentNode: HTMLElement;
  private readonly logger: Log;
  private currentColor: Color = new Hex({ hex: "#000000" });
  private mouseOffsetPosition: IMouseOffsetPosition;
  private windowSize: IWindowSize = window;
  private state: STATE = STATE.default;

  constructor(parentNode: HTMLElement) {
    super();

    this.dialDomsPackage = colorDialTemplate();

    this.parentNode = parentNode;

    this.logger = new Log();
  }

  /**
   * run after instance to attach events and add self to don tree
   */
  public init(): void {
    this.attachMoveEvents();

    this.attachInputEvents();

    this.attachUtilsEvents();

    this.appendSelfToParentNode();
  }

  /**
   * delete all events as well as the node self
   */
  public delete(): void {
    this.removeMoveEvents();

    this.removeInputEvents();

    this.removeUtilsEvents();

    this.removeSelfFromParentNode();
  }

  public changeColor(color: Color): void {
    this.logger.info("color change from other panel");

    this.changeCurrentColor(color);
  }

  public getRGB(): IRGB {
    return this.currentColor.getRGB();
  }

  public getHex(): IHex {
    return this.currentColor.getHex();
  }

  private appendSelfToParentNode(): void {
    this.parentNode.appendChild(this.dialDomsPackage.colorDial);
  }

  private removeSelfFromParentNode(): void {
    this.parentNode.removeChild(this.dialDomsPackage.colorDial);
  }

  // -----------------------------------------------------------------------------------------

  private attachMoveEvents(): void {
    const { colorDial } = this.dialDomsPackage;

    colorDial.addEventListener("mousedown", this.mousedown, true);

    colorDial.addEventListener("mousemove", this.mousemove, true);

    colorDial.addEventListener("mouseup", this.mouseup, true);

    this.parentNode.addEventListener("mousemove", this.mousemove, true);

    this.parentNode.addEventListener("mouseup", this.mouseup, true);
  }

  private removeMoveEvents(): void {
    const { colorDial } = this.dialDomsPackage;

    colorDial.removeEventListener("mousedown", this.mousedown, true);

    colorDial.removeEventListener("mousemove", this.mousemove, true);

    colorDial.removeEventListener("mouseup", this.mouseup, true);

    this.parentNode.removeEventListener("mousemove", this.mousemove, true);

    this.parentNode.removeEventListener("mouseup", this.mouseup, true);
  }

  private mousedown = (e): void => {
    const { target, offsetX, offsetY } = e;

    if (!this.canAcceptMousedown(target)) {
      return;
    }

    this.state = STATE.move;

    this.updateDetectLayer();

    this.updateMousePosition(offsetX, offsetY);
  }

  private mousemove = (e): void => {
    const { buttons, pageX, pageY } = e;

    if (!this.canAcceptMouseMove()) {
      return;
    }

    if (!this.canContinueMouseMove(buttons)) {
      this.mouseup(); // if you loose the left mouse button, then stop moving

      return;
    }

    const nodePos = this.getMovedNodePosition(pageX, pageY);

    this.updateColorDialNodePosition(nodePos);
  }

  private mouseup = (): void => {
    this.state = STATE.default;

    this.moveColorDialWithinClientScope();

    this.updateDetectLayer();
  }

  private canAcceptMousedown(target: HTMLElement): boolean {
    return target.isSameNode(this.dialDomsPackage.colorDial) && this.state === STATE.default;
  }

  private canAcceptMouseMove(): boolean {
    return this.state === STATE.move;
  }

  private canContinueMouseMove(buttons: number) {
    return buttons === 1;
  }

  private updateDetectLayer(): void {
    switch (this.state) {
      case STATE.default:
        this.parentNode.classList.add("noPointerEvents");
        break;
      case STATE.move:
        this.parentNode.classList.remove("noPointerEvents");
        break;
      default:
    }
  }

  private updateMousePosition(offsetX: number, offsetY: number): void {
    this.mouseOffsetPosition = { offsetX, offsetY };
  }

  private getMovedNodePosition(pageX: number, pageY: number): INodePosition {
    const x = pageX - this.mouseOffsetPosition.offsetX;
    const y = pageY - this.mouseOffsetPosition.offsetY;

    return { x, y };
  }

  private moveColorDialWithinClientScope(): void {
    const { colorDial } = this.dialDomsPackage;
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = colorDial;
    const { innerWidth, innerHeight } = this.windowSize;
    const pos = { x: offsetLeft, y: offsetTop };

    if (offsetLeft < 0) {
      pos.x = 0;
    } else if (offsetLeft + offsetWidth > innerWidth) {
      pos.x = innerWidth - offsetWidth;
    }

    if (offsetTop < 0) {
      pos.y = 0;
    } else if (offsetTop + offsetHeight > innerHeight) {
      pos.y = innerHeight - offsetHeight;
    }

    if (innerWidth <= offsetWidth) {
      pos.x = 0;
    }

    if (innerWidth <= offsetHeight) {
      pos.y = 0;
    }

    this.updateColorDialNodePosition(pos);
  }

  private updateColorDialNodePosition({ x, y }: INodePosition): void {
    const { colorDial } = this.dialDomsPackage;

    window.requestAnimationFrame(() => {
      colorDial.style.left = x + "px";
      colorDial.style.top = y + "px";
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
    const { value } = e.target;
    const hex = new Hex({ hex: value });

    this.changeCurrentColor(hex);

    this.logger.info("color change from colorDial input change");
  }

  private changeCurrentColor(color: Color): void {
    this.currentColor = color;

    this.updateInputDisplay();

    this.notifyObservers();
  }

  private updateInputDisplay() {
    const { colorInputL, colorInputR } = this.dialDomsPackage;
    const { hex } = this.currentColor.getHex();

    colorInputL.value = hex;
    colorInputR.value = hex;
  }

  // -----------------------------------------------------------------------------------------

  private attachUtilsEvents() {
    const { colorDial } = this.dialDomsPackage;

    window.addEventListener("resize", this.windowResize, true);

    colorDial.addEventListener("drop", this.preventAndStop, true);

    colorDial.addEventListener("dragover", this.preventAndStop, true);

    colorDial.addEventListener("contextmenu", this.preventAndStop, true);
  }

  private removeUtilsEvents() {
    const { colorDial } = this.dialDomsPackage;

    window.removeEventListener("resize", this.windowResize, true);

    colorDial.removeEventListener("drop", this.preventAndStop, true);

    colorDial.removeEventListener("dragover", this.preventAndStop, true);

    colorDial.removeEventListener("contextmenu", this.preventAndStop, true);
  }

  private windowResize = (): void => {
    this.windowSize = window;

    this.moveColorDialWithinClientScope();
  }

  private preventAndStop = (e): void => {
    e.preventDefault();
    e.stopPropagation();
  }
}

export {
  ColorDial,
  IColorDial,
};
