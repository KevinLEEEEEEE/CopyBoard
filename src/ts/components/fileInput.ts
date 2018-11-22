import Log from "../utils/log/log";

type IRegisterFunc = (base64: string, name: string) => void;

export default class FileInput {
  private readonly fileInputNode: HTMLElement;
  private inputEventListeners: IRegisterFunc[] = [];
  private logger: Log;

  constructor(fileInputNode: HTMLElement) {
    this.fileInputNode = fileInputNode;

    this.logger = new Log();
  }

  // -----------------------------------------------------------------------------------------

  public init(): void {
    this.attachInputEvents();

    this.logger.info("init fileInput successfully");
  }

  public delete(): void {
    this.removeInputEvents();
  }

  public registerEvents(func: IRegisterFunc): void {
    this.inputEventListeners.push(func);
  }

  // -----------------------------------------------------------------------------------------

  private attachInputEvents(): void {
    this.fileInputNode.addEventListener("dragover", this.preventAndStop, true);

    this.fileInputNode.addEventListener("drop", this.drop, true);
  }

  private removeInputEvents() {
    this.fileInputNode.removeEventListener("dragover", this.preventAndStop, true);

    this.fileInputNode.removeEventListener("drop", this.drop, true);
  }

  private preventAndStop = (e): void => {
    e.preventDefault();
    e.stopPropagation();
  }

  private drop = (e): void => {
    this.preventAndStop(e);

    const { files } = e.dataTransfer;

    this.handleInputFiles(files);
  }

  // -----------------------------------------------------------------------------------------

  private handleInputFiles(files): void {
   for (const file of files) {
     const base64: string = window.URL.createObjectURL(file);
     const name: string = file.name.split(".")[0]; // use Regular Expression later

     this.informEventListeners(base64, name);
   }
  }

  private informEventListeners(base64: string, name: string): void {
    this.inputEventListeners.forEach((listener) => {
      listener(base64, name);
    });
  }
}
