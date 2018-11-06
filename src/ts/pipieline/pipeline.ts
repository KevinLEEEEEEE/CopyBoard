import Logger from "../utils/log/log";
import Lightness from "./lightness";

const enum pipelineType {
  lightness,
}

interface IPipelineComponents {
  lightnessBtn: HTMLElement;
}

class Pipeline {
  private pipeFlow: symbol[] = [];
  private pipeLut: object = {};
  private readyToDelete: symbol[] = [];
  private componentNodes: IPipelineComponents;
  private parentNode: HTMLElement;
  private isChanged: boolean = false;
  private imageData: ImageData;
  private logger: Logger;

  constructor(parentNode: HTMLElement) {
    this.parentNode = parentNode;
  }

  public init(imageData: ImageData): void {
    this.imageData = imageData;

    this.isChanged = true;

    this.attachPipeEvents();

    this.getComponentBtnNodes();

    this.attachComponentBtnEvents();

    this.logger = new Logger();
  }

  public delete(): void {
    this.removePipeEvents();

    this.removeComponentBtnEvents();
  }

  public setImageData(imageData: ImageData) {
    this.imageData = imageData;

    this.isChanged = true;

    this.runPipeline(imageData)
    .then((data) => {
      this.isChanged = false;
    });
  }

  private getComponentBtnNodes(): void {
    const lightnessBtn = document.getElementById("lightnessBtn"); // error handler required

    this.componentNodes = {
      lightnessBtn,
    };
  }

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
  }

  private deleteEvent = (e: CustomEvent) => {
    const { id } = e.detail;

    this.readyToDelete.push(id);

    this.runPipeline(this.imageData);
  }

  private async runPipeline(imageData: ImageData): Promise<ImageData> {
    const defaultValue = Promise.resolve({ imageData, isChanged: this.isChanged });

    const outputData = await this.pipeFlow.reduce((prev, current) => {
      const { component } = this.pipeLut[current];

      return prev.then((value) => component.run(value));
    }, defaultValue);

    this.cleanDeletedComponents(); // run after pipeline to ensure the "changed"

    this.logger.info("output: " + outputData.imageData.data[0]);

    const data = new Uint8ClampedArray([ //
      0, 0, 0, 0, 1, 1, 1, 1,
      2, 2, 2, 2, 3, 3, 3, 3,
    ]);
    this.imageData = new ImageData(data, 2, 2); //

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

  private attachComponentBtnEvents(): void {
    const { lightnessBtn } = this.componentNodes;

    lightnessBtn.addEventListener("click", this.componentBtnClick, true);
  }

  private removeComponentBtnEvents(): void {
    const { lightnessBtn } = this.componentNodes;

    lightnessBtn.removeEventListener("click", this.componentBtnClick, true);
  }

  private componentBtnClick = (e) => {
    const { name } = e.target;

    switch (name) {
      case "lightness":
      this.createAndAppendComponent(pipelineType.lightness);
      break;
      default:
    }
  }

  private createAndAppendComponent(type: pipelineType) {
    const id = this.getID(type);
    const component = this.getComponent(type, id, this.parentNode);

    this.addComponentToPipe(type, id, component);

    this.runPipeline(this.imageData);
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
