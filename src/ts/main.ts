import CanvasBoard from "./canvasBoard";
import ColorDial from "./colorDial";
import FileInput from "./fileInput";
import OutputPanel from "./outputPanel";
import ReferenceBoard from "./referenceBoard";

export default class Main {
  private colorDial: ColorDial;
  private fileInput: FileInput;
  private outputPanel: OutputPanel;
  private canvasBoard: CanvasBoard;

  constructor() {
    const colorDialParentNode: HTMLElement = document.getElementById("colorDialEventsLayer");
    const fileInputDetectNode: HTMLElement = document.getElementById("main");
    const canvasBoardNode: HTMLElement = document.getElementById("canvasBoard");
    const pipelineParentNode: HTMLElement = document.getElementById("pipeline");

    this.colorDial = new ColorDial(colorDialParentNode);

    this.fileInput = new FileInput(fileInputDetectNode);

    this.outputPanel = new OutputPanel(pipelineParentNode);

    this.canvasBoard = new CanvasBoard("canvas", canvasBoardNode);
  }

  public init() {
    this.attachColorChangeEvents();

    this.initComponents();
  }

  private attachColorChangeEvents(): void {
    document.body.addEventListener("colorChange", this.colorChange, true);
  }

  private initComponents(): void {
    this.colorDial.init();

    this.fileInput.init();

    this.fileInput.registerEvents(this.handleFile.bind(this));

    this.outputPanel.init();

    this.canvasBoard.init();
  }

  private handleFile(base64: string, name: string): void {
    this.addReferencrBoard(base64, name);
  }

  private addReferencrBoard(base64: string, name: string): void {
    const parentNode: HTMLElement = document.getElementById("main");
    const referenceBoard = new ReferenceBoard(name, parentNode);

    referenceBoard.init(base64);
  }

  private colorChange = (e: CustomEvent) => {
    const { rgba } = e.detail;
    const [r, g, b] = rgba;

    this.colorDial.setRGBColor(r, g, b);
  }
}
