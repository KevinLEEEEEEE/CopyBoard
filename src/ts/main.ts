import { ColorDial } from "./components/colorDial";
import CanvasBoard from "./components/cvsBoard";
import { OutputPanel } from "./components/outputPanel";
import ReferenceBoard from "./components/refBoard";
import { initCustomElements } from "./components/widgets/widgets";
import FileInput from "./fileInput";

export default class Main {
  private colorDial: ColorDial;
  private fileInput: FileInput;
  private outputPanel: OutputPanel;
  private canvasBoard: CanvasBoard;

  constructor() {
    const colorDialParentNode: HTMLElement = document.getElementById("colorDialEventsLayer");
    const fileInputDetectNode: HTMLElement = document.getElementById("main");
    const canvasBoardParentNode: HTMLElement = document.getElementById("cvsBoardContainer");
    const pipelineParentNode: HTMLElement = document.getElementById("pipeline");

    initCustomElements();

    this.colorDial = new ColorDial(colorDialParentNode);

    this.fileInput = new FileInput(fileInputDetectNode);

    this.outputPanel = new OutputPanel(pipelineParentNode);

    this.canvasBoard = new CanvasBoard("canvas", canvasBoardParentNode, this.colorDial, this.outputPanel);
  }

  public init() {
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
}
