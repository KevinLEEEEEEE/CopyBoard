import Logger from "../utils/log/log";
import Lightness from "./lightness";

const enum pipelineType {
  lightness,
}

class Pipeline {
  private pipeFlow: symbol[] = [];
  private pipeLut: object = {};
  private readyToDelete: symbol[] = [];
  private parentNode: HTMLElement;
  private imageData: ImageData;
  private logger: Logger;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;
  }

  public init(imageData: ImageData): void {
    this.imageData = imageData;

    this.logger = new Logger();

    this.attachPipeEvents();

    this.createAndAppendComponent(); // for test only
    this.createAndAppendComponent(); // for test only
    this.createAndAppendComponent(); // for test only

    this.runPipeline(this.imageData);
  }

  public delete(): void {
    this.removePipeEvents();
  }

  public setImageData(imageData: ImageData) {
    this.imageData = imageData;
  }

  // public run(imageData: ImageData): ImageData {
  //   this.imageData = imageData;

  //   this.runPipeline(imageData);
  // }

  private attachPipeEvents(): void {
    this.parentNode.addEventListener("run", this.runEvent, true);

    this.parentNode.addEventListener("delete", this.deleteEvent, true);
  }

  private removePipeEvents(): void {
    this.parentNode.removeEventListener("run", this.runEvent, true);

    this.parentNode.removeEventListener("delete", this.deleteEvent, true);
  }

  private runEvent = () => {
    this.runPipeline(this.imageData);

    this.imageData.data[0] = 0; // test only
  }

  private deleteEvent = (e: CustomEvent) => {
    const { id } = e.detail;

    this.readyToDelete.push(id);

    this.runPipeline(this.imageData);

    this.imageData.data[0] = 0; // test only
  }

  private async runPipeline(imageData: ImageData): Promise<ImageData> {
    const defaultValue = Promise.resolve({ imageData, isChanged: false });

    console.log("run");

    const outputData = await this.pipeFlow.reduce((prev, current) => {
      const { component } = this.pipeLut[current];

      return prev.then((value) => component.run(value));
    }, defaultValue);

    console.log(outputData); // test only

    this.cleanDeletedComponents();

    return outputData;
  }

  private cleanDeletedComponents(): void {
    while (this.readyToDelete.length !== 0) {
      const id = this.readyToDelete.pop();

      try {
        this.removeComponentFromPipe(id);
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  private createAndAppendComponent() {
    const type = pipelineType.lightness; // for test only

    const id = this.getID(type);
    const component = this.getComponent(type, id, this.parentNode);

    this.addComponentToPipe(type, id, component);

    // this.runPipeline(this.imageData);
  }

  private getID(type: pipelineType): symbol {
    return Symbol(type);
  }

  private getComponent(type: pipelineType, id: symbol, parentNode: HTMLElement): object {
    let component = null;

    switch (type) {
      case pipelineType.lightness:
      component = new Lightness(id, parentNode);
      break;
      default:
    }

    return component;
  }

  private addComponentToPipe(type: pipelineType, id: symbol, component: object) {
    this.pipeFlow.push(id);

    this.pipeLut[id] = { type, component };
  }

  private removeComponentFromPipe(id: symbol) {
    const index = this.pipeFlow.indexOf(id);

    if (index !== -1) {
      this.pipeFlow.splice(index, 1);
    } else {
      throw new Error("cannot find target id in pipeFlow");
    }

    if (Reflect.has(this.pipeLut, id)) {
      Reflect.deleteProperty(this.pipeLut, id);
    } else {
      throw new Error("cannot find target component in pipeFut");
    }
  }
}

export  {
  Pipeline,
  pipelineType,
};