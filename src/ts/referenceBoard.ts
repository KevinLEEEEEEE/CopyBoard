import Board from "./board";
import Pixelate from "./cores/pixelate";
import { IReferenceTemplate, referenceTemplate } from "./templates/referenceTemplate";
import Log from "./utils/log/log";

const REFERENCE_CONTROLLER_HEIGHT = 70;
const DEFAULT_SCALE_RATIO = 0.005;
const WIDTH_LIMITAION_RATIO = 3;
const MIN_BOARD_WIDTH = 300;
const enum STATE {
  default,
  move,
  scale,
  locked,
}

export default class ReferenceBoard extends Board {
  private readonly refDomsPackage: IReferenceTemplate;
  private readonly parentNode: HTMLElement;
  private clickOffsetPos: number[] = [0, 0];
  private clickPagePos: number[] = [0, 0];
  private tmpBoardSize: number[] = [0, 0];
  private isOpacityFocused: boolean = false;
  private isPixelateFocused: boolean = false;
  private isColorPickerFocused: boolean = false;
  private pixelateInstance: Pixelate;
  private logger: Log;
  private state: STATE;

  constructor(name: string, parentNode: HTMLElement) {
    super(name);

    this.parentNode = parentNode;

    this.refDomsPackage = referenceTemplate();

    this.state = STATE.default;

    this.logger = new Log();
  }

  /**
   * run after instance to attach events and add self to don tree
   * @param base64
   */
  public init(base64: string): void {
    this.attachMoveEvents();

    this.attachLayerBtnEvents();

    this.attachSettingBtnEvents();

    this.attachToolsBtnEvebts();

    this.convertBase64ToImage(base64)
      .then((img) => {
        this.displayImageOnCanvas(img);

        this.initPixelatedUtils();

        this.setCanvasParentNode(this.refDomsPackage.cvsContainer);

        this.appendSelfToParentNode();

        this.logger.info("reference board init successfully");
      }, (err) => {
        this.delete();

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

    this.removeToolsBtnEvebts();

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

    this.pixelateInstance = new Pixelate(imageData);
  }

  private appendSelfToParentNode(): void {
    this.parentNode.appendChild(this.refDomsPackage.referenceBoard);
  }

  private removeSelfFromParentNode(): void {
    this.parentNode.removeChild(this.refDomsPackage.referenceBoard);
  }

  // -----------------------------------------------------------------------------------------

  private attachMoveEvents(): void {
    const { cvsContainer } = this.refDomsPackage;

    cvsContainer.addEventListener("mousedown", this.mousedown, true);

    cvsContainer.addEventListener("mousemove", this.mousemove, true);

    cvsContainer.addEventListener("mouseup", this.mouseup, true);

    cvsContainer.addEventListener("mouseleave", this.mouseup, true);
  }

  private removeMoveEvents(): void {
    const { cvsContainer } = this.refDomsPackage;

    cvsContainer.removeEventListener("mousedown", this.mousedown, true);

    cvsContainer.removeEventListener("mousemove", this.mousemove, true);

    cvsContainer.removeEventListener("mouseup", this.mouseup, true);

    cvsContainer.removeEventListener("mouseleave", this.mouseup, true);
  }

  private mousedown = (e): void => {
    const { target } = e;

    if (!this.canAcceptMousedown(target)) {
      return;
    }

    this.updateMousePosition(e);

    this.updateBoardSize();

    this.updateMouseState(e);

    this.updateLayerIndex();
  }

  private mousemove = (e): void => {
    this.logger.info(this.state.toString());
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

    this.updateLayerIndex();
  }

  private canAcceptMousedown(target: HTMLElement): boolean {
    return this.refDomsPackage.cvsContainer.contains(target) && this.state === STATE.default
    && this.isColorPickerFocused === false;
  }

  private updateMousePosition(e): void {
    const { offsetX, offsetY, pageX, pageY } = e;

    this.clickOffsetPos = [offsetX, offsetY];
    this.clickPagePos = [pageX, pageY];
  }

  private updateBoardSize(): void {
    const w = this.getStyleWidth();
    const h = this.getStyleHeight();

    this.tmpBoardSize = [w, h];
  }

  // move mouse with 'ctrl' key pressed means to scale the image
  private updateMouseState(e): void {
    if (e.ctrlKey === true) {
      this.state = STATE.scale;
    } else {
      this.state = STATE.move;
    }
  }

  private updateLayerIndex(): void {
    switch (this.state) {
      case STATE.default:
      case STATE.locked:
      this.refDomsPackage.referenceBoard.classList.remove("tmpTopLayer");
      break;
      case STATE.move:
      case STATE.scale:
      this.refDomsPackage.referenceBoard.classList.add("tmpTopLayer");
      break;
      default:
    }
  }

  private restoreMouseState(): void {
    if (this.state === STATE.move || this.state === STATE.scale) {
      this.state = STATE.default;
    }
  }

  private mousemoveForMove(e): void {
    const { pageX, pageY } = e;

    const x: number = pageX - this.clickOffsetPos[0];
    const y: number = pageY - this.clickOffsetPos[1] - REFERENCE_CONTROLLER_HEIGHT;

    this.updateNodePosition(this.refDomsPackage.referenceBoard, x, y);
  }

   private updateNodePosition(node: HTMLElement, x: number, y: number): void {
    window.requestAnimationFrame(() => {
      node.style.left = x + "px";
      node.style.top = y + "px";
    });
  }

  private mousemoveForScale(e): void {
    const scaleRatio = this.getScaleRatio(this.clickPagePos[0], e.pageX);

    const scaledWidth = this.tmpBoardSize[0] * scaleRatio;
    const scaledHeight = this.tmpBoardSize[1] * scaleRatio;

    if (scaledWidth > MIN_BOARD_WIDTH) {
      this.setStyleWidth(scaledWidth);
      this.setStyleHeight(scaledHeight);
    }
  }

  private getScaleRatio(startPoint: number, endPoint: number): number {
    const moveDistance = endPoint - startPoint;
    const scaleRatio = moveDistance * DEFAULT_SCALE_RATIO + 1;

    return scaleRatio;
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
    const { deleteBtn, lockerBtn } = this.refDomsPackage;

    deleteBtn.removeEventListener("click", this.delete, true);

    lockerBtn.removeEventListener("click", this.locker, true);
  }

  private locker = (): void => {
    if (this.state !== STATE.locked) {
      this.state = STATE.locked;
    } else {
      this.state = STATE.default;
    }

    this.updateLockerIcon();
  }

  private updateLockerIcon(): void {
    const { lockerBtn } = this.refDomsPackage;

    if (this.state === STATE.locked) {
      lockerBtn.classList.remove("unlock");
      lockerBtn.classList.add("lock");
    } else {
      lockerBtn.classList.add("unlock");
      lockerBtn.classList.remove("lock");
    }
  }

  private nameChange = (e): void => {
    const { value } = e.target;

    this.setName(value);
  }

  private opacity = (): void => {
    this.displayOpacityInputAndHideBtn();

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

    try {
      this.changeOpacityOfContent(opacity);
    } catch (e) {
      throw e;
    } finally {
     this.displayBtnAndHideOpacityInput();

     this.isOpacityFocused = false;
    }
  }

  private changeOpacityOfContent(opacity: number): void {
    if (opacity >= 100 && opacity <= 0) {
      throw new Error("out of the range of opacity");
    }

    const { cvsContainer } = this.refDomsPackage;
    const scaledOpacity = opacity / 100;

    cvsContainer.style.opacity = scaledOpacity.toString();
  }

  private displayOpacityInputAndHideBtn(): void {
    const { opacityBtn, opacityInput } = this.refDomsPackage;

    opacityInput.classList.remove("noDisplay");

    opacityBtn.classList.add("noDisplay");

    opacityInput.focus();

    opacityInput.select();
  }

  private displayBtnAndHideOpacityInput(): void {
    const { opacityBtn, opacityInput } = this.refDomsPackage;

    opacityInput.classList.add("noDisplay");

    opacityBtn.classList.remove("noDisplay");
  }

  // -----------------------------------------------------------------------------------------

  private attachToolsBtnEvebts(): void {
    const { cvsContainer, colorPickerBtn, pixelateBtn, pixelateInput } = this.refDomsPackage;

    colorPickerBtn.addEventListener("click", this.colorPicker, true);

    cvsContainer.addEventListener("mousedown", this.pickColor, true);

    pixelateBtn.addEventListener("click", this.pixelate, true);

    pixelateInput.addEventListener("blur", this.pixelateBlur, true);

    pixelateInput.addEventListener("change", this.pixelateChange, true);
  }

  private removeToolsBtnEvebts(): void {
    const { cvsContainer, colorPickerBtn, pixelateBtn, pixelateInput } = this.refDomsPackage;

    colorPickerBtn.removeEventListener("click", this.colorPicker, true);

    cvsContainer.removeEventListener("mousedown", this.pickColor, true);

    pixelateBtn.removeEventListener("click", this.pixelate, true);

    pixelateInput.removeEventListener("blur", this.pixelateBlur, true);

    pixelateInput.removeEventListener("change", this.pixelateChange, true);
  }

  private colorPicker = (): void => {
    this.isColorPickerFocused = true;

    this.changeCursorIcon();
  }

  private pickColor = (e): void => {
    if (this.isColorPickerFocused === false) {
      return;
    }

    const { offsetX, offsetY } = e;
    const rgba = this.getColorAt(offsetX, offsetY);

    this.logger.info(rgba.toString());

    this.isColorPickerFocused = false;

    this.changeCursorIcon();
  }

  private changeCursorIcon(): void {
    const { cvsContainer } = this.refDomsPackage;

    if (this.isColorPickerFocused === true) {
      cvsContainer.classList.add("cursorCrossHair");
    } else {
      cvsContainer.classList.remove("cursorCrossHair");
    }
  }

  private pixelate = (): void => {
    this.displayPixelateInputAndHideBtn();

    this.isPixelateFocused = true;
  }

  private pixelateBlur = (e): void => {
    if (this.isPixelateFocused === true) {
      try {
        this.pixelateChange(e);
      } catch (e) {
        this.logger.error(e);
      }
    }
  }

  private pixelateChange = (e): void => {
    const { value } = e.target;
    const pixelSize = parseInt(value, 10);

    if (typeof pixelSize !== "number") {
      throw new Error("please enter number");
    }

    try {
      this.pixelateContentCanvas(pixelSize);
    } catch (e) {
      this.logger.error(e);
    } finally {
      this.displayBtnAndHidePixelateInput();

      this.isPixelateFocused = false;
    }
  }

  private pixelateContentCanvas(pixelSize: number): void {
    if (pixelSize < 1 || pixelSize > this.getWidth() || pixelSize > this.getHeight()) {
      throw new Error("out of the range of pixel size");
    }

    this.pixelateInstance.getPixelatedImageData(pixelSize, pixelSize)
    .then((imageData) => {
      this.drawImageData(imageData);
    });
  }

  private displayPixelateInputAndHideBtn(): void {
    const { pixelateBtn, pixelateInput } = this.refDomsPackage;

    pixelateInput.classList.remove("noDisplay");

    pixelateBtn.classList.add("noDisplay");

    pixelateInput.focus();

    pixelateInput.select();
  }

  private displayBtnAndHidePixelateInput(): void {
    const { pixelateBtn, pixelateInput } = this.refDomsPackage;

    pixelateInput.classList.add("noDisplay");

    pixelateBtn.classList.remove("noDisplay");
  }
}
