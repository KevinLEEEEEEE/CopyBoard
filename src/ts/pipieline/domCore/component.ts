import { componentTemplate, IComponentTemplate } from "./componentTemplate";
import PipeEventEmitter from "./pipeEventEmitter";
import Logger from "../../utils/log/log";

interface IComponentParams {
  imageData: ImageData;
  isChanged: boolean;
}

interface IDataCore {
  getComputedImageData(imageData: ImageData, params: object): Promise<ImageData>;
}

interface IDomCore {
  getContentContainer(): HTMLElement;
}

abstract class Component {
  private componentDomsPackage: IComponentTemplate;
  private domCore: IDomCore;
  private dataCore: IDataCore;
  private parentNode: HTMLElement;
  private id: symbol;
  private isVisible: boolean = true;
  private isDeleted: boolean = false;
  private isChanged: boolean = false;
  private pipeEventEmitter: PipeEventEmitter;
  private localImageData: ImageData = null;
  private params: object = { lightness: 0 };
  private logger: Logger;

  constructor(id: symbol, name: string, parentNode: HTMLElement) {
    this.id = id;

    this.parentNode = parentNode;

    this.logger = new Logger();

    this.componentDomsPackage = componentTemplate(name);

    this.pipeEventEmitter = new PipeEventEmitter(this.componentDomsPackage.component, this.id);
  }

  public init(dataCore: IDataCore, domCore: IDomCore): void {
    this.dataCore = dataCore;

    this.domCore = domCore;

    this.attachBtnEvents();

    this.attachContentEvents();

    this.appendContentToComponent();

    this.appendSelfToParentNode();
  }

  public async run({ imageData, isChanged }: IComponentParams): Promise<IComponentParams> {
    const changed = isChanged || this.isChanged;

    if (this.localImageData === null) {
      this.logger.info("init, set default imageData");

      this.localImageData = imageData; // for init

      return Promise.resolve({ imageData, isChanged });
    }

    if (this.isVisible === false) {
      this.logger.info("invisible, skip the component");

      this.localImageData = imageData;

      return Promise.resolve({ imageData, isChanged });
    }

    if (this.isDeleted === true) {
      this.logger.info("deleted, remove self from dom");

      this.removeSelfFromParentNode();

      return Promise.resolve({ imageData, isChanged: true });
    }

    if (changed === false) {
      this.logger.info("unchanged, skip the component");

      return Promise.resolve({ imageData: this.localImageData, isChanged: false });
    }

    console.log(this.params);
    console.log(imageData);

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
    this.parentNode.appendChild(this.componentDomsPackage.component);
  }

  private removeSelfFromParentNode(): void {
    this.parentNode.removeChild(this.componentDomsPackage.component);
  }

  private appendContentToComponent(): void {
    const contentContainer = this.domCore.getContentContainer();

    this.componentDomsPackage.componentContent.appendChild(contentContainer);
  }

  private attachBtnEvents(): void {
    const { visibilityBtn, deleteBtn } = this.componentDomsPackage;

    visibilityBtn.addEventListener("click", this.visibility, true);

    deleteBtn.addEventListener("click", this.delete, true);
  }

  private removeBtnEvents(): void {
    const { visibilityBtn, deleteBtn } = this.componentDomsPackage;

    visibilityBtn.removeEventListener("click", this.visibility, true);

    deleteBtn.removeEventListener("click", this.delete, true);
  }

  private visibility = (): void => {
    this.isVisible = !this.isVisible;

    this.updateVisibilityBtnIcon();

    this.pipeEventEmitter.emitRunEvent();
  }

  private delete = (): void => {
    this.isDeleted = true;

    this.pipeEventEmitter.emitDeleteEvent();

    this.removeBtnEvents();
  }

  private updateVisibilityBtnIcon() {
    const { visibilityBtn } = this.componentDomsPackage;

    visibilityBtn.classList.toggle("opacityBlack");
    visibilityBtn.classList.toggle("opacityBlackZero");
  }

  private attachContentEvents(): void {
    const contentContainer = this.domCore.getContentContainer();

    contentContainer.addEventListener("change", this.change, true);
  }

  private change = (e: CustomEvent): void => {
    e.stopPropagation();
    
    this.params = e.detail;

    this.isChanged = true;

    this.pipeEventEmitter.emitRunEvent();
  }
}

export {
  Component,
  IComponentParams,
  IDataCore,
  IDomCore,
};
