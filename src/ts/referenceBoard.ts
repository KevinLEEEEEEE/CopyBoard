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
    this.initImageDisplay();

    this.attachMoveEvents();

    this.attachLayerBtnEvents();

    this.attachScrollEvents();
  }

  public delete(): void {
    this.removeMoveEvents();

    this.removeScrollEvents();

    this.removeLayerBtnEvents();

    this.parentNode.removeChild(this.reference.referenceBoard);
  }

  private initImageDisplay(): void {
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;

      this.setWidth(width);

      this.setHeight(height);

      this.drawImage(img, 0, 0, width, height);

      this.parentNode.appendChild(this.reference.referenceBoard);
    };

    img.src = this.base64;
  }

  private attachMoveEvents(): void {
    this.refCanvas.addEventListener("mousedown", this.mousedown);

    this.refCanvas.addEventListener("mousemove", this.mousemove);

    this.refCanvas.addEventListener("mouseup", this.mouseup);

    this.refCanvas.addEventListener("mouseleave", this.mouseup);
  }

  private removeMoveEvents(): void {
    this.refCanvas.removeEventListener("mousedown", this.mousedown);

    this.refCanvas.removeEventListener("mousemove", this.mousemove);

    this.refCanvas.removeEventListener("mouseup", this.mouseup);
  }

  private mousedown(e): void {
    const { target } = e;

    this.preventAll(e);

    if (!target.isSameNode(this.refCanvas)) {
      return;
    }

    const { offsetX, offsetY } = e;

    this.clickPos = [offsetX, offsetY];

    this.canMove = true;
  }

  private mousemove(e): void {
    this.preventAll(e);

    if (this.canMove !== true) {
      return;
    }

    const { pageX, pageY } = e;
    const [x, y]: number[] = this.getRightPos(pageX - this.clickPos[0], pageY - this.clickPos[1] - 70);

    this.updatePosition(x, y); // improvement required
  }

  private mouseup(): void {
    this.canMove = false;
  }

  private preventAll(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private getRightPos(x: number, y: number): number[] {
    const { clientWidth: cw, clientHeight: ch} = this.reference.referenceBoard;
    const { clientWidth: pw, clientHeight: ph} = this.parentNode;

    if (x < 0) {
      x = 0;
    } else if (x + cw > pw) {
      x = pw - cw;
    }

    if (y < 0) {
      y = 0
    } else if (y + ch > ph) {
      y = ph - ch;
    }

    return [x, y];
  }

  private updatePosition(x: number, y: number): void {
    window.requestAnimationFrame(() => {
      this.reference.referenceBoard.style.left = x + "px";
      this.reference.referenceBoard.style.top = y + "px";
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


