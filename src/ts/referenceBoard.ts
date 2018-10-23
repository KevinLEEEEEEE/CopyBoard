import Board from "./board";
import { IReferenceTemplate, referenceTemplate } from "./templates/referenceTemplate";

const REFERENCE_CONTROLLER_HEIGHT = 70;

export default class ReferenceBoard extends Board {
  private readonly refDomsPackage: IReferenceTemplate;
  private readonly parentNode: HTMLElement;
  private clickOffsetPos: number[] = [0, 0];
  private clickPagePos: number[] = [0, 0];
  private canMove: boolean = false;
  private canScale: boolean = false;

  constructor(name: string, parentNode: HTMLElement) {
    super(name);

    this.parentNode = parentNode;

    this.refDomsPackage = referenceTemplate();
  }

  // -----------------------------------------------------------------------------------------

  public init(base64: string): void {
    this.attachMoveEvents();

    this.attachLayerBtnEvents();

    this.attachSettingBtnEvents();

    this.convertBase64ToImage(base64)
      .then((img) => {
        this.displayImageOnCanvas(img);

        this.setCanvasParentNode(this.refDomsPackage.cvsContainer);

        this.appendSelfToParentNode();
      });
  }

  public delete = (): void => {
    this.removeMoveEvents();

    this.removeLayerBtnEvents();

    this.removeSettingBtnEvents();

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

    this.setStyleWidth(width);

    this.setStyleHeight(height);

    this.flushTmpStyleSize();

    this.drawImage(img, 0, 0, width, height);
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

    this.updateMouseData(e);

    this.updateMouseState(e);

    this.moveSelfToTopLevel();
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

    this.flushTmpStyleSize();

    this.moveSelfBackFromTopLevel();
  }

  private canAcceptMousedown(target: HTMLElement): boolean {
    return this.refDomsPackage.cvsContainer.contains(target) && !this.islocked();
  }

  private updateMouseData(e): void {
    const { offsetX, offsetY, pageX, pageY } = e;

    this.clickOffsetPos = [offsetX, offsetY];
    this.clickPagePos = [pageX, pageY];
  }

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

  private mousemoveForScale(e): void {
    const moveDistance = e.pageX - this.clickPagePos[0];

    this.scale(moveDistance * 0.01 + 1);
  }

  private moveSelfToTopLevel(): void {
    this.refDomsPackage.referenceBoard.classList.add("tmpTopLayer");
  }

  private moveSelfBackFromTopLevel(): void {
    this.refDomsPackage.referenceBoard.classList.remove("tmpTopLayer");
  }

  private updateNodePosition(node: HTMLElement, x: number, y: number): void {
    window.requestAnimationFrame(() => {
      node.style.left = x + "px";
      node.style.top = y + "px";
    });
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
}
