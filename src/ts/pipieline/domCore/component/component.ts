import Logger from "../../../utils/log/log";
import { ILightnessParams, ISaturationParams } from "../../dataCore/paramsInterface/paramsInterface";
import PipeEventEmitter from "../utils/pipeEventEmitter";
import { componentTemplate, IComponentTemplate } from "./componentTemplate";
import DataCore from "./dataCore";
import DomCore from "./domCore";

interface IComponentParams {
  imageData: ImageData;
  isChanged: boolean;
}

abstract class Component {
  // private componentDomsPackage: IComponentTemplate;
  private domCore;
  private dataCore: DataCore;
  private parentNode: HTMLElement;
  private id: symbol;
  private isVisible: boolean = true;
  private isDeleted: boolean = false;
  private isChanged: boolean = false;
  private pipeEventEmitter: PipeEventEmitter;
  private localImageData: ImageData = null;
  private params: ILightnessParams | ISaturationParams;
  private logger: Logger;

  constructor(id: symbol, name: string, parentNode: HTMLElement) {
    this.id = id;

    this.parentNode = parentNode;

    this.logger = new Logger();
  }

  public init(dataCore: DataCore, domCore): void {
    this.dataCore = dataCore;

    this.domCore = domCore;

    this.pipeEventEmitter = new PipeEventEmitter(domCore, this.id);

    this.appendSelfToParentNode();

    this.attachContentEvents();

    this.attachBtnEvents();
  }

  public async run({ imageData, isChanged }: IComponentParams): Promise<IComponentParams> {
    const changed = isChanged || this.isChanged;

    if (this.isDeleted === false) {
      this.logger.info("params: ", this.params); // for test
    }

    if (this.localImageData === null) {
      this.logger.info("init, set default imageData");

      this.localImageData = imageData; // init localstorage after created

      return Promise.resolve({ imageData, isChanged });
    }

    if (this.isVisible === false) {
      this.logger.info("invisible, skip the component");

      return Promise.resolve({ imageData, isChanged });
    }

    if (this.isDeleted === true) {
      this.logger.info("deleted, remove self from dom");

      return Promise.resolve({ imageData, isChanged: true });
    }

    if (changed === false) {
      this.logger.info("unchanged, skip the component");

      return Promise.resolve({ imageData: this.localImageData, isChanged: false });
    }

    const computedImageData = await this.dataCore.getComputedImageData(imageData, this.params)
      .then((data) => {
        this.logger.info("changed, run component successfully");

        this.localImageData = data;

        this.isChanged = false;

        return Promise.resolve({ imageData: data, isChanged: true });
      }, (err) => {
        this.logger.error(err);

        this.localImageData = imageData;

        return Promise.resolve({ imageData, isChanged });
      })
      .catch((err) => {
        this.logger.error(err);

        this.localImageData = imageData;

        return Promise.resolve({ imageData, isChanged });
      });

    return computedImageData;
  }

  private appendSelfToParentNode(): void {
    this.parentNode.appendChild(this.domCore);
  }

  private removeSelfFromParentNode(): void {
    this.parentNode.removeChild(this.domCore);
  }

  private attachBtnEvents(): void {
    this.domCore.addEventListener("displayToggle", this.visibility, false);

    this.domCore.addEventListener("deleted", this.delete, false);
  }

  private removeBtnEvents(): void {
    this.domCore.removeEventListener("displayToggle", this.visibility, false);

    this.domCore.removeEventListener("deleted", this.delete, false);
  }

  private visibility = (e): void => {
    e.stopPropagation();

    this.isVisible = e.detail.isVisible;

    this.pipeEventEmitter.emitRunEvent();
  }

  private delete = (e): void => {
    e.stopPropagation();

    this.isDeleted = true;

    this.pipeEventEmitter.emitDeleteEvent();

    this.removeBtnEvents();

    this.removeContentEvents();

    this.removeSelfFromParentNode();
  }

  private attachContentEvents(): void {
    this.domCore.addEventListener("changed", this.changed, false);
  }

  private removeContentEvents(): void {
    this.domCore.removeEventListener("changed", this.changed, false);
  }

  private changed = (e: CustomEvent): void => {
    e.stopPropagation();

    this.params = e.detail;

    this.isChanged = true;

    this.pipeEventEmitter.emitRunEvent();
  }
}

export default Component;
