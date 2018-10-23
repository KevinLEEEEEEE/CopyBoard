type IRegisterFunc = (base64: string, name: string) => void;

export default class FileInput {
  private readonly fileInputNode: HTMLElement;
  private inputEventListeners: IRegisterFunc[] = [];

  constructor(fileInputNode: HTMLElement) {
    this.fileInputNode = fileInputNode;

    this.attachInputEvents = this.attachInputEvents.bind(this);

    this.drop = this.drop.bind(this);
  }

  // -----------------------------------------------------------------------------------------

  public init(): void {
    this.attachInputEvents();
  }

  public delete(): void {
    this.removeInputEvents();
  }

  public registerEvents(func: IRegisterFunc): void {
    this.inputEventListeners.push(func);
  }

  // -----------------------------------------------------------------------------------------

  private attachInputEvents(): void {
    this.fileInputNode.addEventListener("dragover", this.preventAndStop);

    this.fileInputNode.addEventListener("drop", this.drop);
  }

  private removeInputEvents() {
    this.fileInputNode.removeEventListener("dragover", this.preventAndStop);

    this.fileInputNode.removeEventListener("drop", this.drop);
  }

  private preventAndStop(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private drop(e): void {
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
