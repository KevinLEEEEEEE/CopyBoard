import Board from "./board";
import { ShadowBoard, shadowMode } from "./shadowBoard";
import { canvasTemplate, ICanvasTemplate } from "./templates/canvasTemplate";
import ColorChangeEventEmitter from "./utils/colorChangeEventEmitter";
import Log from "./utils/log/log";

const CANVAS_CONTROLLER_HEIGHT = 70;
const DEFAULT_SCALE_RATIO = 0.1;
const SCALE_LIMITAION_RATIO = 5;
const MIN_BOARD_WIDTH = 300;
const OPACITY_RATIO = 0.6;
const enum STATE {
  default = "default",
  move = "move",
  scale = "scale",
  pen = "pen",
  eraser = "eraser",
  bucket = "bucket",
  pickColor = "pickColor",
}

class CanvasBoard extends ShadowBoard {
  private readonly colorChangeEventEmitter: ColorChangeEventEmitter;
  private readonly cvsDomsPackage: ICanvasTemplate;
  private readonly parentNode: HTMLElement;
  private clickOffsetPos: number[] = [0, 0];
  private clickPagePos: number[] = [0, 0];
  private currentScaleRatio: number = 10;
  private isOpacityFocused: boolean = false;
  private isLocked: boolean = false;
  private state: STATE;
  private logger: Log;

  constructor(name: string, parentNode: HTMLElement) {
    super(name);

    this.parentNode = parentNode;

    this.cvsDomsPackage = canvasTemplate();

    this.colorChangeEventEmitter = new ColorChangeEventEmitter(parentNode);

    this.initStateMachine();

    this.logger = new Log();
  }

  public init(): void {
    const width = 40;
    const height = 30;

    this.setStyleWidth(width * this.currentScaleRatio); //

    this.setStyleHeight(height * this.currentScaleRatio); //

    this.setWidth(width); //

    this.setHeight(height); //

    this.attachMoveEvents();

    this.attachPaintEvents();

    this.attachSettingBtnEvents();

    this.setCanvasParentNode(this.cvsDomsPackage.cvsContainer);

    this.appendSelfToParentNode();
  }

  public delete(): void {
    this.removeMoveEvents();

    this.removeSettingBtnEvents();

    this.removeSelfFromParentNode();
  }

  private appendSelfToParentNode(): void {
    this.parentNode.appendChild(this.cvsDomsPackage.canvasBoard);
  }

  private removeSelfFromParentNode(): void {
    this.parentNode.removeChild(this.cvsDomsPackage.canvasBoard);
  }

  private initStateMachine(): void {
    const that = this;

    Reflect.defineProperty(this, "state", {
      get() {
        return this._state;
      },

      set(state: STATE) {
        that.updateCursorStyle(this._state, state);

        that.updateShadowBoardState(state);

        this._state = state;
      },
    });

    this.state = STATE.default;
  }

  private updateCursorStyle = (prevState: STATE, currentState: STATE): void => {
    this.toggleCursorStyle(prevState);

    this.toggleCursorStyle(currentState);
  }

  private toggleCursorStyle(state: STATE): void {
    const { cvsContainer } = this.cvsDomsPackage;

    switch (state) {
      case STATE.move:
      cvsContainer.classList.toggle("cursorMove");
      break;
      case STATE.scale:
      cvsContainer.classList.toggle("cursorResize");
      break;
      case STATE.pickColor:
      cvsContainer.classList.toggle("cursorCrossHair");
      break;
      case STATE.pen:
      case STATE.eraser:
      case STATE.bucket:
      cvsContainer.classList.toggle("cursorShortCrossHair");
      break;
      default:
    }
  }

  private updateShadowBoardState(state: STATE): void {
    switch (state) {
      case STATE.pen:
      case STATE.bucket:
      this.restartShadowBoard();
      this.changeShadowMode(shadowMode.pen);
      break;
      case STATE.eraser:
      this.restartShadowBoard();
      this.changeShadowMode(shadowMode.eraser);
      break;
      case STATE.default:
      default:
      this.pauseShadowBoard();
      break;
    }
  }

  // -----------------------------------------------------------------------------------------

  private attachMoveEvents(): void {
    const { moveBtn, cvsContainer } = this.cvsDomsPackage;

    moveBtn.addEventListener("click", this.moveBtn, true);

    cvsContainer.addEventListener("mousedown", this.mousedown, true);

    cvsContainer.addEventListener("mousemove", this.mousemove, true);

    cvsContainer.addEventListener("mouseup", this.mouseup, true);

    cvsContainer.addEventListener("mouseleave", this.mouseup, true);
  }

  private removeMoveEvents(): void {
    const { moveBtn, cvsContainer } = this.cvsDomsPackage;

    moveBtn.removeEventListener("click", this.moveBtn, true);

    cvsContainer.removeEventListener("mousedown", this.mousedown, true);

    cvsContainer.removeEventListener("mousemove", this.mousemove, true);

    cvsContainer.removeEventListener("mouseup", this.mouseup, true);

    cvsContainer.removeEventListener("mouseleave", this.mouseup, true);
  }

  private moveBtn = () => {
    this.state = STATE.default;
  }

  private mousedown = (e): void => {
    const { target } = e;

    if (!this.canAcceptMousedown(target)) {
      return;
    }

    this.updateMouseState(e);

    this.updateMousePosition(e);

    this.updateLayerZIndex();
  }

  private mousemove = (e): void => {
    switch (this.state) {
      case STATE.move:
      this.mousemoveForMove(e);
      break;
      case STATE.scale:
      this.mousemoveForScale(e);
      break;
      default:
    }
  }

  private mouseup = (): void => {
    this.restoreMouseState();

    this.updateScaleRatio();

    this.updateLayerZIndex();
  }

  private canAcceptMousedown(target: HTMLElement): boolean {
    return this.cvsDomsPackage.cvsContainer.contains(target) &&
            this.state === STATE.default &&
            this.isLocked === false;
  }

  private updateMousePosition(e): void {
    const { offsetX, offsetY, pageX, pageY } = e;

    this.clickOffsetPos = [offsetX, offsetY];
    this.clickPagePos = [pageX, pageY];
  }

  // move mouse with 'ctrl' key pressed means to scale the image
  private updateMouseState(e): void {
    if (e.ctrlKey === true) {
      this.state = STATE.scale;
    } else {
      this.state = STATE.move;
    }
  }

  private updateLayerZIndex(): void {
    if (this.state === STATE.move || this.state === STATE.scale) {
      this.cvsDomsPackage.cvsContainer.classList.add("tmpTopLayer");
    } else {
      this.cvsDomsPackage.cvsContainer.classList.remove("tmpTopLayer");
    }
  }

  private updateScaleRatio(): void {
    this.currentScaleRatio = this.getCurrentScaleRatio();
  }

  private restoreMouseState(): void {
    if (this.state === STATE.move || this.state === STATE.scale) {
      this.state = STATE.default;
    }
  }

  private mousemoveForMove(e): void {
    const { pageX, pageY } = e;

    const x: number = pageX - this.clickOffsetPos[0];
    const y: number = pageY - this.clickOffsetPos[1] - CANVAS_CONTROLLER_HEIGHT;

    this.updateNodePosition(this.cvsDomsPackage.canvasBoard, x, y);
  }

   private updateNodePosition(node: HTMLElement, x: number, y: number): void {
    window.requestAnimationFrame(() => {
      node.style.left = x + "px";
      node.style.top = y + "px";
    });
  }

  private mousemoveForScale(e): void {
    const scaleRatio = this.getScaleRatio(this.clickPagePos[0], e.pageX);
    const scaleRatioInt = Math.floor(scaleRatio);
    const currentScaleRatio = this.currentScaleRatio + scaleRatioInt;

    if (currentScaleRatio >= SCALE_LIMITAION_RATIO) {
      const defaultWidth = this.getWidth();
      const defaultHeight = this.getHeight();
      const scaledWidth = defaultWidth * currentScaleRatio;
      const scaledHeight = defaultHeight * currentScaleRatio;

      if (scaledWidth >= MIN_BOARD_WIDTH) {
        this.setStyleWidth(scaledWidth);
        this.setStyleHeight(scaledHeight);
      }
    }
  }

  private getScaleRatio(startPoint: number, endPoint: number): number {
    const moveDistance = endPoint - startPoint;
    const scaleRatio = moveDistance * DEFAULT_SCALE_RATIO;

    return scaleRatio;
  }

  // -----------------------------------------------------------------------------------------

  private attachSettingBtnEvents(): void {
    const { settingBtn, lockerBtn, nameInput, opacityBtn, opacityInput } = this.cvsDomsPackage;

    lockerBtn.addEventListener("click", this.locker, true);

    nameInput.addEventListener("change", this.nameChange, true);

    opacityBtn.addEventListener("click", this.opacity, true);

    opacityInput.addEventListener("blur", this.opacityBlur, true);

    opacityInput.addEventListener("change", this.opacityChange, true);
  }

  private removeSettingBtnEvents(): void {
    const { settingBtn, lockerBtn, nameInput, opacityBtn, opacityInput } = this.cvsDomsPackage;

    lockerBtn.removeEventListener("click", this.locker, true);

    nameInput.removeEventListener("change", this.nameChange, true);

    opacityBtn.removeEventListener("click", this.opacity, true);

    opacityInput.removeEventListener("blur", this.opacityBlur, true);

    opacityInput.removeEventListener("change", this.opacityChange, true);
  }

  private locker = (): void => {
    this.isLocked = !this.isLocked;

    this.updateLockerIcon();
  }

  private updateLockerIcon(): void {
    const { lockerBtn } = this.cvsDomsPackage;

    lockerBtn.classList.toggle("unlock");
    lockerBtn.classList.toggle("lock");
  }

  private nameChange = (e): void => {
    const { value } = e.target;

    this.setName(value);
  }

  private opacity = (): void => {
    this.updateOpacityInputAndBtn();

    this.focusAndSelectOpacityInput();

    this.isOpacityFocused = true;
  }

  private opacityBlur = (e): void => {
    if (this.isOpacityFocused === true) {
      try {
        this.opacityChange(e);
      } catch (e) {
        this.logger.error(e);
      }
    }
  }

  private opacityChange = (e): void => {
    const { value } = e.target;
    const opacity = parseInt(value, 10);

    if (typeof opacity !== "number") {
      throw new Error("please enter number");
    }

    if (opacity >= 100 && opacity <= 0) {
      throw new Error("out of the range of opacity");
    }

    this.changeOpacityOfContent(opacity);

    this.changeOpacityOfIcon(opacity);

    this.updateOpacityInputAndBtn();

    this.isOpacityFocused = false;
  }

  private changeOpacityOfContent(opacity: number): void {
    const { cvsContainer } = this.cvsDomsPackage;
    const scaledOpacity = opacity / 100;

    cvsContainer.style.opacity = scaledOpacity.toString();
  }

  private changeOpacityOfIcon(opacity: number): void {
    const { opacityBtn } = this.cvsDomsPackage;
    const iconOpacity =  (100 - (100 - opacity) * OPACITY_RATIO) / 100;

    if (opacity === 0) {
      opacityBtn.classList.add("opacityZero");
    } else {
      opacityBtn.classList.remove("opacityZero");
    }

    opacityBtn.style.opacity = iconOpacity.toString();
  }

  private updateOpacityInputAndBtn(): void {
    const { opacityBtn, opacityInput } = this.cvsDomsPackage;

    opacityInput.classList.toggle("noDisplay");

    opacityBtn.classList.toggle("noDisplay");
  }

  private focusAndSelectOpacityInput(): void {
    const { opacityInput } = this.cvsDomsPackage;

    opacityInput.focus();

    opacityInput.select();
  }

  // -----------------------------------------------------------------------------------------

  private attachPaintEvents(): void {
    const { penBtn, eraserBtn, cvsContainer } = this.cvsDomsPackage;

    penBtn.addEventListener("click", this.pen, true);

    eraserBtn.addEventListener("click", this.eraser, true);

    cvsContainer.removeEventListener("mousedown", this.paintStart, true);

    cvsContainer.removeEventListener("mouseup", this.paintEnd, true);
  }

  private pen = () => {
    this.state = STATE.pen;
  }

  private eraser = () => {
    this.state = STATE.eraser;
  }

  private paintStart = () => {

  }

  private paintEnd = () => {

  }
}

export default CanvasBoard;
