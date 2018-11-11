import { RGB } from "../cores/color/rgb";
import IObserver from "../cores/observer/observer";
import Log from "../utils/log/log";
import { IColorDial } from "./colorDial";
import { IOutputPanel } from "./outputPanel";
import { ShadowBoard, shadowMode } from "./shadowBoard";
import { canvasTemplate, ICanvasTemplate } from "./templates/canvasTemplate";

const DEFAULT_SCALE_RATIO = 0.05;
const CONTROLLER_HEIGHT = 70;
const MIN_BOARD_WIDTH = 300;
const OPACITY_RATIO = 0.6;
const enum STATE {
  default,
  move,
  scale,
  pen,
  eraser,
  bucket,
  pickColor,
}

interface IWindowSize {
  innerWidth: number;
  innerHeight: number;
}

interface IMouseOffsetPosition {
  offsetX: number;
  offsetY: number;
}

class CanvasBoard extends ShadowBoard implements IObserver {
  private readonly cvsDomsPackage: ICanvasTemplate;
  private readonly parentNode: HTMLElement;
  private readonly outputPanel: IOutputPanel;
  private readonly colorDial: IColorDial;
  private mouseOffsetPosition: IMouseOffsetPosition;
  private windowSize: IWindowSize = window;
  private tmpScaleRatio: number;
  private isOpacityFocused: boolean = false;
  private isPaintStarted: boolean = false;
  private isLocked: boolean = false;
  private state: STATE;
  private logger: Log;

  constructor(name: string, parentNode: HTMLElement, colorDial: IColorDial, outputPanel: IOutputPanel) {
    super(name, 40, 30, 10);

    this.colorDial = colorDial;

    this.outputPanel = outputPanel;

    this.parentNode = parentNode;

    this.cvsDomsPackage = canvasTemplate();

    this.initStateMachine();

    this.logger = new Log();
  }

  public init(): void {
    this.attachMoveEvents();

    this.attachPaintEvents();

    this.attachToolsEvents();

    this.attachSettingBtnEvents();

    this.attachUtilsEvents();

    this.activePixelBoard();

    this.setCanvasParentNode(this.cvsDomsPackage.cvsContainer);

    this.appendSelfToParentNode();
  }

  public delete(): void {
    this.removeMoveEvents();

    this.removePaintEvents();

    this.removeToolsEvents();

    this.removeSettingBtnEvents();

    this.removeUtilsEvents();

    this.removeSelfFromParentNode();
  }

  public setFillColor(hex: string): void {
    super.setFillColor(hex);
  }

  public update(): void {
    const { hex } = this.colorDial.getHex();

    this.setFillColor(hex);
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

        this._state = state;

        that.updateShadowBoardState();

        that.updateCvsBoardNodeZIndex();

        that.updateDetectLayer();
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

  private updateShadowBoardState(): void {
    switch (this.state) {
      case STATE.pen:
      case STATE.bucket:
        this.restartShadowMode();
        this.changeShadowMode(shadowMode.pen);
        break;
      case STATE.eraser:
        this.restartShadowMode();
        this.changeShadowMode(shadowMode.eraser);
        break;
      case STATE.default:
      default:
        this.pauseShadowMode();
        break;
    }
  }

  private updateCvsBoardNodeZIndex(): void {
    const { canvasBoard } = this.cvsDomsPackage;

    switch (this.state) {
      case STATE.default:
      case STATE.pickColor:
      case STATE.pen:
      case STATE.eraser:
      case STATE.bucket:
        canvasBoard.classList.remove("tmpTopLayer");
        break;
      case STATE.move:
      case STATE.scale:
        canvasBoard.classList.add("tmpTopLayer");
        break;
    }
  }

  private updateDetectLayer(): void {
    const { canvasBoard } = this.cvsDomsPackage;
    const parentNode = this.parentNode;

    switch (this.state) {
      case STATE.default:
      case STATE.pickColor:
        parentNode.classList.add("noPointerEvents");
        parentNode.classList.add("initialPointerEventsForChildren");
        canvasBoard.classList.remove("initialPointerEvents");
        break;
      case STATE.move:
      case STATE.scale:
        parentNode.classList.remove("noPointerEvents");
        parentNode.classList.remove("initialPointerEventsForChildren");
        canvasBoard.classList.add("initialPointerEvents");
        break;
      default:
    }
  }

  // -----------------------------------------------------------------------------------------

  private attachMoveEvents(): void {
    const { canvasBoard } = this.cvsDomsPackage;

    canvasBoard.addEventListener("mousedown", this.mousedown, true);

    canvasBoard.addEventListener("mousemove", this.mousemove, true);

    canvasBoard.addEventListener("mouseup", this.mouseup, true);

    this.parentNode.addEventListener("mousemove", this.mousemove, true);

    this.parentNode.addEventListener("mouseup", this.mousemove, true);
  }

  private removeMoveEvents(): void {
    const { canvasBoard } = this.cvsDomsPackage;

    canvasBoard.removeEventListener("mousedown", this.mousedown, true);

    canvasBoard.removeEventListener("mousemove", this.mousemove, true);

    canvasBoard.removeEventListener("mouseup", this.mouseup, true);

    this.parentNode.removeEventListener("mousemove", this.mousemove, true);

    this.parentNode.removeEventListener("mouseup", this.mousemove, true);
  }

  private mousedown = (e): void => {
    const { target, offsetX, offsetY, ctrlKey } = e;

    if (!this.canAcceptMousedown(target)) {
      return;
    }

    this.updateMouseState(ctrlKey);

    this.updateTmpScaleRatio();

    this.updateMousePosition(offsetX, offsetY);
  }

  // move mouse with 'ctrl' key pressed means to scale the image
  private updateMouseState(isCtrlKeyPressed: boolean): void {
    if (isCtrlKeyPressed === true) {
      this.state = STATE.scale;
    } else {
      this.state = STATE.move;
    }
  }

  private mousemove = (e): void => {
    const { pageX, pageY, offsetX, buttons } = e;

    if (!this.canAcceptMouseMove()) {
      return;
    }

    if (!this.canContinueMouseMove(buttons)) {
      this.mouseup(); // if you loose the left mouse button, then stop moving

      return;
    }

    switch (this.state) {
      case STATE.move:
        this.mousemoveForMove(pageX, pageY);
        break;
      case STATE.scale:
        this.mousemoveForScale(offsetX);
        break;
      default:
    }
  }

  private mouseup = (): void => {
    if (this.state === STATE.move || this.state === STATE.scale) {
      this.state = STATE.default;

      this.moveRefBoardlWithinClientScope();
    }
  }

  private canAcceptMousedown(target: HTMLElement): boolean {
    return this.cvsDomsPackage.cvsContainer.contains(target) &&
      this.state === STATE.default &&
      this.isLocked === false;
  }

  private canAcceptMouseMove(): boolean {
    return this.state === STATE.move || this.state === STATE.scale;
  }

  private canContinueMouseMove(buttons: number) {
    return buttons === 1;
  }

  private updateMousePosition(offsetX: number, offsetY: number): void {
    this.mouseOffsetPosition = { offsetX, offsetY };
  }

  private updateTmpScaleRatio(): void {
    this.tmpScaleRatio = this.getStyleWidth() / this.getWidth();
  }

  private mousemoveForMove(pageX: number, pageY: number): void {
    const x: number = pageX - this.mouseOffsetPosition.offsetX;
    const y: number = pageY - this.mouseOffsetPosition.offsetY - CONTROLLER_HEIGHT;

    this.updateCvsBoardNodePosition(x, y);
  }

  private updateCvsBoardNodePosition(x: number, y: number): void {
    const { canvasBoard } = this.cvsDomsPackage;

    window.requestAnimationFrame(() => {
      canvasBoard.style.left = x + "px";
      canvasBoard.style.top = y + "px";
    });
  }

  private mousemoveForScale(offsetX: number): void {
    const moveDistance = offsetX - this.mouseOffsetPosition.offsetX;
    const scaleRatio = this.getScaleRatioFromMoveDistance(moveDistance);
    const combinedScaleRatio = this.tmpScaleRatio + scaleRatio;
    const scaledWidth = this.getWidth() * combinedScaleRatio;
    const scaledHeight = this.getHeight() * combinedScaleRatio;

    if (scaledWidth > MIN_BOARD_WIDTH) {
      this.setStyleWidth(scaledWidth);
      this.setStyleHeight(scaledHeight);
    }
  }

  private getScaleRatioFromMoveDistance(moveDistance: number): number {
    return Math.floor(moveDistance * DEFAULT_SCALE_RATIO);
  }

  private moveRefBoardlWithinClientScope(): void {
    const { canvasBoard } = this.cvsDomsPackage;
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = canvasBoard;
    const { innerWidth, innerHeight } = this.windowSize;
    const pos = { x: offsetLeft, y: offsetTop };

    if (offsetLeft + 20 >= innerWidth) {
      pos.x = innerWidth - 20;
    } else if (offsetLeft + offsetWidth <= 20) {
      pos.x = -offsetWidth + 20;
    }

    if (offsetTop + 20 + CONTROLLER_HEIGHT >= innerHeight) {
      pos.y = innerHeight - 20 - CONTROLLER_HEIGHT;
    } else if (offsetTop + offsetHeight <= 20) {
      pos.y = -offsetHeight + 20;
    }

    this.updateCvsBoardNodePosition(pos.x, pos.y);
  }

  // -----------------------------------------------------------------------------------------

  private attachToolsEvents(): void {
    const { colorPickerBtn, cvsContainer } = this.cvsDomsPackage;

    colorPickerBtn.addEventListener("click", this.colorPicker, true);

    cvsContainer.addEventListener("click", this.pickColor, true);

    cvsContainer.addEventListener("contextmenu", this.contextmenu, true);
  }

  private removeToolsEvents(): void {
    const { colorPickerBtn, cvsContainer } = this.cvsDomsPackage;

    colorPickerBtn.removeEventListener("click", this.colorPicker, true);

    cvsContainer.removeEventListener("click", this.pickColor, true);

    cvsContainer.removeEventListener("contextmenu", this.contextmenu, true);
  }

  private colorPicker = (): void => {
    this.state = STATE.pickColor;
  }

  private pickColor = (e): void => {
    const { buttons, offsetX, offsetY } = e;

    if (this.state !== STATE.pickColor) {
      return;
    }

    if (buttons !== 2) {
      const [r, g, b] = this.getColorAt(offsetX, offsetY);
      const rgb = new RGB({ r, g, b });

      this.colorDial.changeColor(rgb);
    }

    this.state = STATE.default;
  }

  private contextmenu(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  // -----------------------------------------------------------------------------------------

  private attachSettingBtnEvents(): void {
    const { moveBtn, settingBtn, lockerBtn, nameInput, opacityBtn, opacityInput } = this.cvsDomsPackage;

    moveBtn.addEventListener("click", this.moveBtn, true);

    settingBtn.addEventListener("click", this.setting, true);

    lockerBtn.addEventListener("click", this.locker, true);

    nameInput.addEventListener("change", this.nameChange, true);

    opacityBtn.addEventListener("click", this.opacity, true);

    opacityInput.addEventListener("blur", this.opacityBlur, true);

    opacityInput.addEventListener("change", this.opacityChange, true);
  }

  private removeSettingBtnEvents(): void {
    const { moveBtn, settingBtn, lockerBtn, nameInput, opacityBtn, opacityInput } = this.cvsDomsPackage;

    moveBtn.removeEventListener("click", this.moveBtn, true);

    settingBtn.removeEventListener("click", this.setting, true);

    lockerBtn.removeEventListener("click", this.locker, true);

    nameInput.removeEventListener("change", this.nameChange, true);

    opacityBtn.removeEventListener("click", this.opacity, true);

    opacityInput.removeEventListener("blur", this.opacityBlur, true);

    opacityInput.removeEventListener("change", this.opacityChange, true);
  }

  private moveBtn = () => {
    this.state = STATE.default;
  }

  private setting = (): void => {
    const imageData = this.getImageData();

    this.outputPanel.updateOutputImage(imageData);
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
    if (this.isOpacityFocused !== true) {
      return;
    }

    try {
      this.opacityChange(e);
    } catch (err) {
      this.updateOpacityInputAndBtn();

      this.isOpacityFocused = false;

      this.logger.error(err);
    }
  }

  private opacityChange = (e): void => {
    const { value } = e.target;
    const opacity = parseInt(value, 10);

    if (typeof opacity !== "number") {
      throw new Error("please enter number");
    }

    if (opacity > 100 || opacity < 0) {
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

    window.requestAnimationFrame(() => {
      cvsContainer.style.opacity = scaledOpacity.toString();
    });
  }

  private changeOpacityOfIcon(opacity: number): void {
    const { opacityBtn } = this.cvsDomsPackage;
    const iconOpacity = (100 - (100 - opacity) * OPACITY_RATIO) / 100;

    if (opacity === 0) {
      opacityBtn.classList.add("opacityZero");
    } else {
      opacityBtn.classList.remove("opacityZero");
    }

    window.requestAnimationFrame(() => {
      opacityBtn.style.opacity = iconOpacity.toString();
    });
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
    const { penBtn, eraserBtn, bucketBtn, cvsContainer } = this.cvsDomsPackage;

    penBtn.addEventListener("click", this.pen, true);

    eraserBtn.addEventListener("click", this.eraser, true);

    bucketBtn.addEventListener("click", this.bucket, true);

    cvsContainer.addEventListener("mousedown", this.paintBegin);

    cvsContainer.addEventListener("mousemove", this.painting, true);

    cvsContainer.addEventListener("mouseup", this.paintEnd, true);

    cvsContainer.addEventListener("mouseleave", this.paintEnd, true);
  }

  private removePaintEvents(): void {
    const { penBtn, eraserBtn, bucketBtn, cvsContainer } = this.cvsDomsPackage;

    penBtn.removeEventListener("click", this.pen, true);

    eraserBtn.removeEventListener("click", this.eraser, true);

    bucketBtn.removeEventListener("click", this.bucket, true);

    cvsContainer.removeEventListener("mousedown", this.paintBegin);

    cvsContainer.removeEventListener("mousemove", this.painting, true);

    cvsContainer.removeEventListener("mouseup", this.paintEnd, true);

    cvsContainer.removeEventListener("mouseleave", this.paintEnd, true);
  }

  private pen = () => {
    this.state = STATE.pen;
  }

  private eraser = () => {
    this.state = STATE.eraser;
  }

  private bucket = () => {
    this.state = STATE.bucket;
  }

  private paintBegin = (e) => {
    const { layerX, layerY } = e;

    switch (this.state) {
      case STATE.pen:
      case STATE.eraser:
        this.isPaintStarted = true;
        this.painting(e);
        break;
      case STATE.bucket:
        this.bucketPaint(layerX, layerY);
        break;
      case STATE.move:
      case STATE.scale:
      case STATE.pickColor:
      default:
        this.isPaintStarted = false;
    }
  }

  private painting = (e) => {
    if (this.isPaintStarted === false) {
      return;
    }

    const { layerX, layerY } = e;

    switch (this.state) {
      case STATE.pen:
        this.penPaint(layerX, layerY);
        break;
      case STATE.eraser:
        this.eraserPaint(layerX, layerY);
        break;
      case STATE.bucket:
      default:
    }
  }

  private paintEnd = () => {
    this.isPaintStarted = false;
  }

  private penPaint(layerX: number, layerY: number): void {
    this.fillContentRect(layerX, layerY);
  }

  private eraserPaint(layerX: number, layerY: number): void {
    this.clearContentRect(layerX, layerY);
  }

  private bucketPaint(layerX: number, layerY: number): void {
    this.fillContentBucket(layerX, layerY);
  }

  // -----------------------------------------------------------------------------------------

  private attachUtilsEvents() {
    const { canvasBoard } = this.cvsDomsPackage;

    window.addEventListener("resize", this.windowResize, true);

    canvasBoard.addEventListener("drop", this.preventAndStop, true);

    canvasBoard.addEventListener("dragover", this.preventAndStop, true);

    canvasBoard.addEventListener("contextmenu", this.preventAndStop, true);
  }

  private removeUtilsEvents() {
    const { canvasBoard } = this.cvsDomsPackage;

    window.removeEventListener("resize", this.windowResize, true);

    canvasBoard.removeEventListener("drop", this.preventAndStop, true);

    canvasBoard.removeEventListener("dragover", this.preventAndStop, true);

    canvasBoard.removeEventListener("contextmenu", this.preventAndStop, true);
  }

  private windowResize = (): void => {
    this.windowSize = window;

    this.moveRefBoardlWithinClientScope();
  }

  private preventAndStop = (e): void => {
    e.preventDefault();
    e.stopPropagation();
  }
}

export default CanvasBoard;
