import { ColorDial } from "./components/colorDial";
import CanvasBoard from "./components/cvsBoard";
import FileInput from "./components/fileInput";
import { OutputPanel } from "./components/outputPanel";
import ReferenceBoard from "./components/refBoard";
import { initCustomElements } from "./components/widgets/widgets";

export default class Main {
  private colorDial: ColorDial;
  private fileInput: FileInput;
  private outputPanel: OutputPanel;
  private canvasBoard: CanvasBoard;

  constructor() {
    const colorDialParentNode: HTMLElement = document.getElementById("colorDialEventsLayer");
    const fileInputDetectNode: HTMLElement = document.getElementById("main");
    const pipelineParentNode: HTMLElement = document.getElementById("pipeline");

    this.colorDial = new ColorDial(colorDialParentNode);

    this.fileInput = new FileInput(fileInputDetectNode);

    this.outputPanel = new OutputPanel(pipelineParentNode);

    initCustomElements();

    this.attachInitialPanel();
  }

  private initApp = (w: number, h: number) => {
    const canvasBoardParentNode: HTMLElement = document.getElementById("cvsBoardContainer");

    this.canvasBoard = new CanvasBoard("canvas", canvasBoardParentNode, this.colorDial, this.outputPanel, w, h);

    this.initComponents();
  }

  private initComponents(): void {
    this.colorDial.init();

    this.colorDial.attach(this.canvasBoard);

    this.fileInput.init();

    this.fileInput.registerEvents(this.handleFile);

    this.canvasBoard.init();

    this.outputPanel.init();
  }

  private handleFile = (base64: string, name: string): void => {
    this.addReferencrBoard(base64, name);
  }

  private addReferencrBoard(base64: string, name: string): void {
    const parentNode: HTMLElement = document.getElementById("refBoardContainer");
    const referenceBoard = new ReferenceBoard(name, parentNode, this.colorDial);

    referenceBoard.init(base64);
  }

  private attachInitialPanel(): void {
    const initial = document.querySelector(".initial");
    const initAppBtn = document.getElementById("initApp");
    const widthInput = document.getElementById("canvasWidth") as HTMLInputElement;
    const heightInput = document.getElementById("canvasHeight") as HTMLInputElement;

    initAppBtn.addEventListener("click", () => {
      this.initApp(this.getValidNumber(widthInput.value), this.getValidNumber(heightInput.value));

      initial.classList.add("noDisplay");
    }, false);
  }

  private getValidNumber(str: string): number {
    const num = parseInt(str, 10);

    return isNaN(num) === false ? num : 32;
  }
}
