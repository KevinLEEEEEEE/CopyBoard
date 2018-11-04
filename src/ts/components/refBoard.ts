import { RGB } from "../cores/color/rgb";
import Pixelate from "../cores/pixelate/pixelate";
import { IReferenceTemplate, referenceTemplate } from "../templates/referenceTemplate";
import Log from "../utils/log/log";
import Board from "./board";
import { IColorChange } from "./colorDial";

const REFERENCE_CONTROLLER_HEIGHT = 70;
const DEFAULT_SCALE_RATIO = 0.005;
const WIDTH_LIMITAION_RATIO = 3;
const MIN_BOARD_WIDTH = 300;
const OPACITY_RATIO = 0.6;
const enum STATE {
  default,
  move,
  scale,
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

export default class ReferenceBoard extends Board {
  private readonly refDomsPackage: IReferenceTemplate;
  private readonly parentNode: HTMLElement;
  private mouseOffsetPosition: IMouseOffsetPosition;
  private windowSize: IWindowSize = window;
  private currentScaleRatio: number;
  private isPixelateProcessing: boolean = false;
  private isPixelateFocused: boolean = false;
  private isOpacityFocused: boolean = false;
  private isLocked: boolean = false;
  private colorDial: IColorChange;
  private pixelate: Pixelate;
  private state: STATE;
  private logger: Log;

  constructor(name: string, parentNode: HTMLElement, colorDial: IColorChange) {
    super(name);

    this.colorDial = colorDial;

    this.parentNode = parentNode;

    this.refDomsPackage = referenceTemplate();

    this.initStateMachine();

    this.logger = new Log();
  }

  /**
   * run after instance to attach events and add self to don tree
   * @param base64
   */
  public init(base64: string): void {
    this.convertBase64ToImage(base64)
      .then((img) => {
        this.attachMoveEvents();

        this.attachLayerBtnEvents();

        this.attachSettingBtnEvents();

        this.attachToolsBtnEvents();

        this.attachUtilsEvents();

        this.displayImageOnCanvas(img);

        this.updateCurrentScaleRatio();

        this.initPixelatedUtils();

        this.setCanvasParentNode(this.refDomsPackage.cvsContainer);

        this.appendSelfToParentNode();

        this.logger.info("reference board init successfully");
      }, (err) => {
        this.logger.error("fail to convert base64 to image", err);
      });
  }

  /**
   * delete all events as well as the node self
   */
  public delete = (): void => {
    this.removeMoveEvents();

    this.removeLayerBtnEvents();

    this.removeSettingBtnEvents();

    this.removeToolsBtnEvents();

    this.removeUtilsEvents();

    this.removeSelfFromParentNode();
  }

  private convertBase64ToImage(base64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve(img);
      };

      img.onerror = (err) => {
        reject(err);
      };

      img.src = base64;
    });
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

        that.updateRefBoardNodeZIndex();

        that.updateDetectLayer();
      },
    });

    this.state = STATE.default;
  }

  private displayImageOnCanvas(img: HTMLImageElement): void {
    const { width, height } = img;

    this.setWidth(width);

    this.setHeight(height);

    this.scaleImageToFitTheParentSize(img);

    this.drawImage(img, 0, 0, width, height);
  }

  private scaleImageToFitTheParentSize(img: HTMLImageElement): void {
    let { width, height } = img;
    const { clientWidth } = this.parentNode;
    const limitedWidth = clientWidth / WIDTH_LIMITAION_RATIO;

    if (width > limitedWidth) {
      const scaleRatio = width / limitedWidth;
      width = limitedWidth;
      height /= scaleRatio;
    }

    this.setStyleWidth(width);

    this.setStyleHeight(height);
  }

  private initPixelatedUtils() {
    const imageData = this.getImageData();

    this.pixelate = new Pixelate(imageData);
  }

  private appendSelfToParentNode(): void {
    this.parentNode.appendChild(this.refDomsPackage.referenceBoard);
  }

  private removeSelfFromParentNode(): void {
    this.parentNode.removeChild(this.refDomsPackage.referenceBoard);
  }

  private updateCursorStyle = (prevState: STATE, currentState: STATE): void => {
    this.toggleCursorStyle(prevState);

    this.toggleCursorStyle(currentState);
  }

  private toggleCursorStyle(state: STATE): void {
    const { cvsContainer } = this.refDomsPackage;

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
    }
  }

  private updateRefBoardNodeZIndex(): void {
    const { referenceBoard } = this.refDomsPackage;

    switch (this.state) {
      case STATE.default:
      case STATE.pickColor:
        referenceBoard.classList.remove("tmpTopLayer");
        break;
      case STATE.move:
      case STATE.scale:
        referenceBoard.classList.add("tmpTopLayer");
        break;
    }
  }

  private updateDetectLayer(): void {
    const { referenceBoard } = this.refDomsPackage;
    const parentNode = this.parentNode;

    switch (this.state) {
      case STATE.default:
      case STATE.pickColor:
        parentNode.classList.add("noPointerEvents");
        parentNode.classList.add("initialPointerEventsForChildren");
        referenceBoard.classList.remove("initialPointerEvents");
        break;
      case STATE.move:
      case STATE.scale:
        parentNode.classList.remove("noPointerEvents");
        parentNode.classList.remove("initialPointerEventsForChildren");
        referenceBoard.classList.add("initialPointerEvents");
        break;
      default:
    }
  }

  // -----------------------------------------------------------------------------------------

  private attachMoveEvents(): void {
    const { cvsContainer } = this.refDomsPackage;

    cvsContainer.addEventListener("mousedown", this.mousedown, true);

    cvsContainer.addEventListener("mousemove", this.mousemove, true);

    cvsContainer.addEventListener("mouseup", this.mouseup, true);

    this.parentNode.addEventListener("mousemove", this.mousemove, true);

    this.parentNode.addEventListener("mouseup", this.mousemove, true);
  }

  private removeMoveEvents(): void {
    const { cvsContainer } = this.refDomsPackage;

    cvsContainer.removeEventListener("mousedown", this.mousedown, true);

    cvsContainer.removeEventListener("mousemove", this.mousemove, true);

    cvsContainer.removeEventListener("mouseup", this.mouseup, true);

    cvsContainer.removeEventListener("mouseleave", this.mouseup, true);

    this.parentNode.removeEventListener("mousemove", this.mousemove, true);

    this.parentNode.removeEventListener("mouseup", this.mousemove, true);
  }

  private mousedown = (e): void => {
    const { target, offsetX, offsetY, ctrlKey } = e;

    if (!this.canAcceptMousedown(target)) {
      return;
    }

    this.updateMouseState(ctrlKey);

    this.updateCurrentScaleRatio();

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
    this.state = STATE.default;

    this.moveRefBoardlWithinClientScope();
  }

  private canAcceptMousedown(target: HTMLElement): boolean {
    return this.refDomsPackage.cvsContainer.contains(target) &&
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

  private updateCurrentScaleRatio(): void {
    this.currentScaleRatio = this.getStyleWidth() / this.getWidth();
  }

  private mousemoveForMove(pageX: number, pageY: number): void {
    const x: number = pageX - this.mouseOffsetPosition.offsetX;
    const y: number = pageY - this.mouseOffsetPosition.offsetY - REFERENCE_CONTROLLER_HEIGHT;

    this.updateRefBoardNodePosition(x, y);
  }

  private updateRefBoardNodePosition(x: number, y: number): void {
    const { referenceBoard } = this.refDomsPackage;

    window.requestAnimationFrame(() => {
      referenceBoard.style.left = x + "px";
      referenceBoard.style.top = y + "px";
    });
  }

  private mousemoveForScale(offsetX: number): void {
    const moveDistance = offsetX - this.mouseOffsetPosition.offsetX;
    const scaleRatio = this.getScaleRatioFromMoveDistance(moveDistance);
    const combinedScaleRatio = this.currentScaleRatio + scaleRatio;
    const scaledWidth = this.getWidth() * combinedScaleRatio;
    const scaledHeight = this.getHeight() * combinedScaleRatio;

    if (scaledWidth > MIN_BOARD_WIDTH) {
      this.setStyleWidth(scaledWidth);
      this.setStyleHeight(scaledHeight);
    }
  }

  private getScaleRatioFromMoveDistance(moveDistance: number): number {
    return moveDistance * DEFAULT_SCALE_RATIO;
  }

  private moveRefBoardlWithinClientScope(): void {
    const { referenceBoard } = this.refDomsPackage;
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = referenceBoard;
    const { innerWidth, innerHeight } = this.windowSize;
    const pos = { x: offsetLeft, y: offsetTop };

    if (offsetLeft + 20 >= innerWidth) {
      pos.x = innerWidth - 20;
    } else if (offsetLeft + offsetWidth <= 20) {
      pos.x = -offsetWidth + 20;
    }

    if (offsetTop + 20 + REFERENCE_CONTROLLER_HEIGHT >= innerHeight) {
      pos.y = innerHeight - 20 - REFERENCE_CONTROLLER_HEIGHT;
    } else if (offsetTop + offsetHeight <= 20) {
      pos.y = -offsetHeight + 20;
    }

    this.updateRefBoardNodePosition(pos.x, pos.y);
  }

  // -----------------------------------------------------------------------------------------

  private attachLayerBtnEvents(): void {
    const { moveUpBtn, moveTopBtn, moveDownBtn, moveBottomBtn } = this.refDomsPackage;

    moveUpBtn.addEventListener("click", this.moveUp, true);

    moveTopBtn.addEventListener("click", this.moveTop, true);

    moveDownBtn.addEventListener("click", this.moveDown, true);

    moveBottomBtn.addEventListener("click", this.moveBottom, true);
  }

  private removeLayerBtnEvents(): void {
    const { moveUpBtn, moveTopBtn, moveDownBtn, moveBottomBtn } = this.refDomsPackage;

    moveUpBtn.removeEventListener("click", this.moveUp, true);

    moveTopBtn.removeEventListener("click", this.moveTop, true);

    moveDownBtn.removeEventListener("click", this.moveDown, true);

    moveBottomBtn.removeEventListener("click", this.moveBottom, true);
  }

  private moveUp = (): void => {
    const { nextSibling } = this.refDomsPackage.referenceBoard;

    if (nextSibling !== null) {
      const { nextSibling: nextSiblingOfNext } = nextSibling;

      if (nextSiblingOfNext === null) {
        this.moveTop();
      } else {
        this.parentNode.insertBefore(this.refDomsPackage.referenceBoard, nextSiblingOfNext);
      }
    }
  }

  private moveTop = (): void => {
    this.parentNode.appendChild(this.refDomsPackage.referenceBoard);
  }

  private moveDown = (): void => {
    const { previousSibling } = this.refDomsPackage.referenceBoard;

    if (previousSibling !== null) {
      this.parentNode.insertBefore(this.refDomsPackage.referenceBoard, previousSibling);
    }
  }

  private moveBottom = (): void => {
    const { firstChild } = this.parentNode;

    if (firstChild !== null && !this.refDomsPackage.referenceBoard.isSameNode(firstChild)) {
      this.parentNode.insertBefore(this.refDomsPackage.referenceBoard, firstChild);
    }
  }

  // -----------------------------------------------------------------------------------------

  private attachSettingBtnEvents(): void {
    const { deleteBtn, lockerBtn, nameInput, opacityBtn, opacityInput } = this.refDomsPackage;

    deleteBtn.addEventListener("click", this.delete, true);

    lockerBtn.addEventListener("click", this.locker, true);

    nameInput.addEventListener("change", this.nameChange, true);

    opacityBtn.addEventListener("click", this.opacity, true);

    opacityInput.addEventListener("blur", this.opacityBlur, true);

    opacityInput.addEventListener("change", this.opacityChange, true);
  }

  private removeSettingBtnEvents(): void {
    const { deleteBtn, lockerBtn, nameInput, opacityBtn, opacityInput } = this.refDomsPackage;

    deleteBtn.removeEventListener("click", this.delete, true);

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
    const { lockerBtn } = this.refDomsPackage;

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

    if (opacity >= 100 || opacity <= 0) {
      throw new Error("out of the range of opacity");
    }

    this.changeOpacityOfContent(opacity);

    this.changeOpacityOfIcon(opacity);

    this.updateOpacityInputAndBtn();

    this.isOpacityFocused = false;
  }

  private changeOpacityOfContent(opacity: number): void {
    const { cvsContainer } = this.refDomsPackage;
    const scaledOpacity = opacity / 100;

    window.requestAnimationFrame(() => {
      cvsContainer.style.opacity = scaledOpacity.toString();
    });
  }

  private changeOpacityOfIcon(opacity: number): void {
    const { opacityBtn } = this.refDomsPackage;
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
    const { opacityBtn, opacityInput } = this.refDomsPackage;

    opacityInput.classList.toggle("noDisplay");

    opacityBtn.classList.toggle("noDisplay");
  }

  private focusAndSelectOpacityInput(): void {
    const { opacityInput } = this.refDomsPackage;

    opacityInput.focus();

    opacityInput.select();
  }

  // -----------------------------------------------------------------------------------------

  private attachToolsBtnEvents(): void {
    const { cvsContainer, colorPickerBtn, pixelateBtn, pixelateInput } = this.refDomsPackage;

    colorPickerBtn.addEventListener("click", this.colorPicker, true);

    cvsContainer.addEventListener("mousedown", this.pickColor, true);

    cvsContainer.addEventListener("contextmenu", this.contextmenu, true);

    pixelateBtn.addEventListener("click", this.pixelateActive, true);

    pixelateInput.addEventListener("blur", this.pixelateBlur, true);

    pixelateInput.addEventListener("change", this.pixelateChange, true);
  }

  private removeToolsBtnEvents(): void {
    const { cvsContainer, colorPickerBtn, pixelateBtn, pixelateInput } = this.refDomsPackage;

    colorPickerBtn.removeEventListener("click", this.colorPicker, true);

    cvsContainer.removeEventListener("mousedown", this.pickColor, true);

    cvsContainer.removeEventListener("contextmenu", this.contextmenu, true);

    pixelateBtn.removeEventListener("click", this.pixelateActive, true);

    pixelateInput.removeEventListener("blur", this.pixelateBlur, true);

    pixelateInput.removeEventListener("change", this.pixelateChange, true);
  }

  private colorPicker = (): void => {
    this.state = STATE.pickColor;
  }

  private pickColor = (e): void => {
    const { buttons, offsetX, offsetY } = e;

    if (this.state !== STATE.pickColor) {
      return;
    }

    this.logger.info("pick");

    if (buttons !== 2) {
      const [r, g, b] = this.getColorAt(offsetX, offsetY);
      const rgb: RGB = new RGB({ r, g, b });

      this.colorDial.changeColor(rgb);
    }

    this.state = STATE.default;
  }

  private contextmenu(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private pixelateActive = (): void => {
    this.updatePixelateInputAndBtn();

    this.focusAndSelectPixelateInput();

    this.isPixelateFocused = true;
  }

  private pixelateBlur = (e): void => {
    if (this.isPixelateFocused !== true || this.isPixelateProcessing === true) {
      return;
    }

    try {
      this.pixelateChange(e);
    } catch (err) {
      this.updatePixelateInputAndBtn();

      this.isPixelateFocused = false;

      this.logger.error(err);
    }
  }

  private pixelateChange = (e): void => {
    const { value } = e.target;
    const pixelSize = parseInt(value, 10);

    if (typeof pixelSize !== "number") {
      throw new Error("please enter number");
    }

    if (pixelSize < 1 || pixelSize > this.getWidth() || pixelSize > this.getHeight()) {
      throw new Error("out of the range of pixel size");
    }

    this.pixelateContentCanvas(pixelSize);

    this.updatePixelateInputAndBtn();

    this.isPixelateFocused = false;

  }

  private pixelateContentCanvas(pixelSize: number): void {
    this.isPixelateProcessing = true;

    this.pixelate.getPixelatedImageData(pixelSize, pixelSize)
      .then((imageData) => {
        this.drawImageData(imageData);

        this.isPixelateProcessing = false;
      });
  }

  private updatePixelateInputAndBtn(): void {
    const { pixelateBtn, pixelateInput } = this.refDomsPackage;

    pixelateInput.classList.toggle("noDisplay");

    pixelateBtn.classList.toggle("noDisplay");
  }

  private focusAndSelectPixelateInput(): void {
    const { pixelateInput } = this.refDomsPackage;

    pixelateInput.focus();

    pixelateInput.select();
  }

  // -----------------------------------------------------------------------------------------

  private attachUtilsEvents() {
    const { referenceBoard } = this.refDomsPackage;

    window.addEventListener("resize", this.windowResize, true);

    referenceBoard.addEventListener("drop", this.preventAndStop, true);

    referenceBoard.addEventListener("dragover", this.preventAndStop, true);

    referenceBoard.addEventListener("contextmenu", this.preventAndStop, true);
  }

  private removeUtilsEvents() {
    const { referenceBoard } = this.refDomsPackage;

    window.removeEventListener("resize", this.windowResize, true);

    referenceBoard.removeEventListener("drop", this.preventAndStop, true);

    referenceBoard.removeEventListener("dragover", this.preventAndStop, true);

    referenceBoard.removeEventListener("contextmenu", this.preventAndStop, true);
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
