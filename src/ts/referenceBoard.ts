import Board from "./board";
import { IReferenceTemplate, referenceTemplate } from "./templates/referenceTemplate";
import Pixelate from "./utils/pixelate";

const REFERENCE_CONTROLLER_HEIGHT = 70;
const DEFAULT_SCALE_RATIO = 0.005;
const WIDTH_LIMITAION_RATIO = 3;
const MIN_BOARD_WIDTH = 300;

export default class ReferenceBoard extends Board {
  private readonly refDomsPackage: IReferenceTemplate;
  private readonly parentNode: HTMLElement;
  private clickOffsetPos: number[] = [0, 0];
  private clickPagePos: number[] = [0, 0];
  private tmpBoardSize: number[] = [0, 0];
  private canMove: boolean = false;
  private canScale: boolean = false;
  private pixelateInstance: Pixelate;

  constructor(name: string, parentNode: HTMLElement) {
    super(name);

    this.parentNode = parentNode;

    this.refDomsPackage = referenceTemplate();
  }

  // -----------------------------------------------------------------------------------------

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

    this.moveSelfToTopLayer();
  }

  private mousemove = (e): void => {
    if (this.canMove === true) {
      this.mousemoveForMove(e);
    } else if (this.canScale === true) {
      this.mousemoveForScale(e);
    }
  }

  private mouseup = (): void => {
    this.restoreMouseState();

    this.moveSelfBackFromTopLayer();
  }

  private canAcceptMousedown(target: HTMLElement): boolean {
    return this.refDomsPackage.cvsContainer.contains(target) && !this.islocked();
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
      this.canScale = true;
    } else {
      this.canMove = true;
    }
  }

  private restoreMouseState(): void {
    this.canMove = false;
    this.canScale = false;
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

  private moveSelfToTopLayer(): void {
    this.refDomsPackage.referenceBoard.classList.add("tmpTopLayer");
  }

  private moveSelfBackFromTopLayer(): void {
    this.refDomsPackage.referenceBoard.classList.remove("tmpTopLayer");
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

  private attachSettingBtnEvents() {
    const { deleteBtn, lockerBtn } = this.refDomsPackage;

    deleteBtn.addEventListener("click", this.delete, true);

    lockerBtn.addEventListener("click", this.locker, true);
  }

  private removeSettingBtnEvents() {
    const { deleteBtn, lockerBtn } = this.refDomsPackage;

    deleteBtn.removeEventListener("click", this.delete, true);

    lockerBtn.removeEventListener("click", this.locker, true);
  }

  private locker = (): void => {
    this.islocked() === true ? this.unlock() : this.lock();
  }

  // -----------------------------------------------------------------------------------------

  private attachToolsBtnEvebts() {
    const { colorPickerBtn, pixelateBtn } = this.refDomsPackage;

    colorPickerBtn.addEventListener("click", this.colorPicker, true);

    pixelateBtn.addEventListener("click", this.pixelate, true);
  }

  private removeToolsBtnEvebts() {
    const { colorPickerBtn, pixelateBtn } = this.refDomsPackage;

    colorPickerBtn.removeEventListener("click", this.colorPicker, true);

    pixelateBtn.removeEventListener("click", this.pixelate, true);
  }

  private colorPicker = () => {
    console.log("plcker");
  }

  private pixelate = () => {
    this.pixelateInstance.getPixelatedImageData(4, 4)
    .then((imageData) => {
      this.drawImageData(imageData);
    });

    // this.drawImageData(ig);
  }
}
