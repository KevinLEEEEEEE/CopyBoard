import { referenceTemplate, IReferenceTemplate } from './templates/referenceTemplate';
import Board from "./board";

export default class ReferenceBoard extends Board {
  private readonly reference: IReferenceTemplate;
  private readonly refCanvas: HTMLCanvasElement;
  private readonly parentNode: HTMLElement;
  private readonly base64: string;
  private clickPos: number[] = [0, 0];
  private canMove: boolean = false;

  constructor(base64: string, name: string, parentNode: HTMLElement) {
    super(name);

    this.parentNode = parentNode;

    this.base64 = base64;

    this.reference = referenceTemplate();

    this.refCanvas = this.getCanvas();

    this.reference.content.appendChild(this.refCanvas);

    this.mousedown = this.mousedown.bind(this);

    this.mousemove = this.mousemove.bind(this);

    this.mouseup = this.mouseup.bind(this);

    this.delete = this.delete.bind(this);

    this.moveUp = this.moveUp.bind(this);

    this.moveTop = this.moveTop.bind(this);

    this.moveDown = this.moveDown.bind(this);

    this.moveBottom = this.moveBottom.bind(this);
  }

  public init(): void {
    this.attachMoveEvents();

    this.attachLayerBtnEvents();

    this.attachScrollEvents();

    this.attachSettingBtnEvents();

    this.initImageDisplay();
  }

  public delete(): void {
    this.removeMoveEvents();

    this.removeScrollEvents();

    this.removeLayerBtnEvents();

    this.removeSettingBtnEvents();

    this.removeFromParent();
  }

  private initImageDisplay(): void {
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;

      this.setWidth(width);

      this.setHeight(height);

      this.drawImage(img, 0, 0, width, height);

      this.appendIntoParent();
    };

    img.src = this.base64;
  }

  private appendIntoParent(): void {
    this.parentNode.appendChild(this.reference.referenceBoard);
  }

  private removeFromParent(): void {
    this.parentNode.removeChild(this.reference.referenceBoard);
  }

  private attachMoveEvents(): void {
    this.refCanvas.addEventListener("mousedown", this.mousedown, true);

    this.refCanvas.addEventListener("mousemove", this.mousemove, true);

    this.refCanvas.addEventListener("mouseup", this.mouseup, true);

    this.refCanvas.addEventListener("mouseleave", this.mouseup, true);
  }

  private removeMoveEvents(): void {
    this.refCanvas.removeEventListener("mousedown", this.mousedown, true);

    this.refCanvas.removeEventListener("mousemove", this.mousemove, true);

    this.refCanvas.removeEventListener("mouseup", this.mouseup, true);
  }

  private mousedown(e): void {
    const { target } = e;

    if (!target.isSameNode(this.refCanvas)) {
      return;
    }

    const { offsetX, offsetY } = e;

    this.clickPos = [offsetX, offsetY];

    this.canMove = true;

    this.moveToTopLevel(this.reference.referenceBoard)
  }

  private mousemove(e): void {
    if (this.canMove !== true) {
      return;
    }

    const { pageX, pageY } = e;
    const { clientWidth, clientHeight } = this.parentNode;

    // small size, with border, large size, no border

    const x: number = this.getRightPosition(pageX, this.clickPos[0], this.getWidth(), clientWidth);
    const y: number = this.getRightPosition(pageY, this.clickPos[1] + 70, this.getHeight() + 70, clientHeight);

    this.updateNodePosition(this.reference.referenceBoard, x, y);
  }

  private mouseup(): void {
    this.canMove = false;

    this.moveBackFromTopLevel(this.reference.referenceBoard);
  }

  private moveToTopLevel(node: HTMLElement): void {
    node.classList.add("tmpTopLayer");
  }

  private moveBackFromTopLevel(node: HTMLElement): void {
    node.classList.remove("tmpTopLayer");
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

  private attachScrollEvents(): void {

  }

  private removeScrollEvents(): void {

  }

  private attachLayerBtnEvents(): void {
    const { moveUpBtn, moveTopBtn, moveDownBtn, moveBottomBtn } = this.reference;

    moveUpBtn.addEventListener("click", this.moveUp);

    moveTopBtn.addEventListener("click", this.moveTop);

    moveDownBtn.addEventListener("click", this.moveDown);

    moveBottomBtn.addEventListener("click", this.moveBottom);
  }

  private removeLayerBtnEvents(): void {
    const { moveUpBtn, moveTopBtn, moveDownBtn, moveBottomBtn } = this.reference;

    moveUpBtn.removeEventListener("click", this.moveUp);

    moveTopBtn.removeEventListener("click", this.moveTop);

    moveDownBtn.removeEventListener("click", this.moveDown);

    moveBottomBtn.removeEventListener("click", this.moveBottom);
  }

  private moveUp(): void {
    const { nextSibling } = this.reference.referenceBoard;

    if (nextSibling !== null) {
      const { nextSibling: nextSiblingOfNext } = nextSibling;

      if (nextSiblingOfNext === null) {
        this.moveTop();
      } else {
        this.parentNode.insertBefore(this.reference.referenceBoard, nextSiblingOfNext);
      }
    }
  }

  private moveTop(): void {
    this.parentNode.appendChild(this.reference.referenceBoard);
  }

  private moveDown(): void {
    const { previousSibling } = this.reference.referenceBoard;

    if (previousSibling !== null) {
      this.parentNode.insertBefore(this.reference.referenceBoard, previousSibling);
    }
  }

  private moveBottom(): void {
    const { firstChild } = this.parentNode;

    if(firstChild !== null && !this.reference.referenceBoard.isSameNode(firstChild)) {
      this.parentNode.insertBefore(this.reference.referenceBoard, firstChild);
    }
  }

  private attachSettingBtnEvents() {
    
  }

  private removeSettingBtnEvents() {
    
  }
}

// delete. lock, styleSize, scroll, border


