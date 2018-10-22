import ColorDial from "./colorDial";
import FileInput from "./fileInput";
import ReferenceBoard from './referenceBoard';

export default class Main {
  public init() {
    const colorDialDom: HTMLElement = document.body;
    const mainDom: HTMLElement = document.getElementById("main");

    const colorDial = new ColorDial(colorDialDom);

    colorDial.init();

    const fileInput1 = new FileInput(mainDom);

    fileInput1.init();

    fileInput1.registerEvents(this.handleFile.bind(this));
  }

  private handleFile(base64: string, name: string): void {
    this.addReferencrBoard(base64, name);
  }

  private addReferencrBoard(base64: string, name: string): void {
    const mainDom: HTMLElement = document.getElementById("main");
    const referenceBoard = new ReferenceBoard(base64, name, mainDom);

    referenceBoard.init();
  }
}
