type IRegisterFunc = (base64: string, name: string) => void;

export default class FileInput {
  private readonly inputNode: HTMLElement;
  private listenters: IRegisterFunc[] = [];

  constructor(inputNode: HTMLElement) {
    this.inputNode = inputNode;

    this.attachInputEvents = this.attachInputEvents.bind(this);

    this.drop = this.drop.bind(this);
  }

  public init(): void {
    this.attachInputEvents();
  }

  public delete(): void {
    this.removeInputEvents();
  }

  public registerEvents(func: IRegisterFunc): void {
    this.listenters.push(func);
  }

  private attachInputEvents(): void {
    this.inputNode.addEventListener("dragover", this.preventAll);

    this.inputNode.addEventListener("drop", this.drop);
  }

  private removeInputEvents() {
    this.inputNode.removeEventListener("dragover", this.preventAll);

    this.inputNode.removeEventListener("drop", this.drop);
  }

  private preventAll(e): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private drop(e): void {
    this.preventAll(e);

    const { files } = e.dataTransfer;

    this.handleFiles(files);
  }

  private handleFiles(files): void {
   for (const file of files) {
     const base64: string = window.URL.createObjectURL(file);
     const name: string = file.name.split(".")[0]; // use Regular Expression later

     this.listenters.forEach((listener) => {
         listener(base64, name);
       });
   }
  }
}
