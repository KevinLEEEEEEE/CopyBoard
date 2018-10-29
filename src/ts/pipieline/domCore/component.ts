import { componentTemplate, IComponentTemplate } from "./componentTemplate";

interface IComponentParams {
  imageData: ImageData;
  isChanged: boolean;
  inheritParams?: object;
}

abstract class Component {
  private componentDomsPackage: IComponentTemplate;
  private parentNode: HTMLElement;
  private id: symbol;
  private visible: boolean = true;
  private deleted: boolean = false;
  private runEvent: CustomEvent;
  private deleteEvent: CustomEvent;

  constructor(id: symbol, name: string, parentNode: HTMLElement) {
    this.id = id;

    this.parentNode = parentNode;

    this.componentDomsPackage = componentTemplate(name);

    this.createPipeEvents();

    this.attachBtnEvents();
  }

  public isVisible(): boolean {
    return this.visible;
  }

  public isDeleted(): boolean {
    return this.deleted;
  }

  public appendSelfToParentNode(): void {
    this.parentNode.appendChild(this.componentDomsPackage.component);
  }

  public removeSelfFromParentNode(): void {
    this.parentNode.removeChild(this.componentDomsPackage.component);
  }

  public setContentNode(contentNode: HTMLElement): void {
    this.componentDomsPackage.componentContent.appendChild(contentNode);
  }

  public abstract run({ imageData, isChanged }: IComponentParams): Promise<IComponentParams>;

  public emitRunEvent(): void {
    this.componentDomsPackage.component.dispatchEvent(this.runEvent);
  }

  public emitDeleteEvent(): void {
    this.componentDomsPackage.component.dispatchEvent(this.deleteEvent);
  }

  private createPipeEvents(): void {
    const eventDict = {
      detail: {
        id: this.id,
      },
      bubbles: true,
      cancelable: false,
      composed: false,
    };

    this.runEvent = new CustomEvent("run", eventDict);

    this.deleteEvent = new CustomEvent("delete", eventDict);
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
    this.visible = !this.visible;

    this.updateVisibilityBtnIcon();

    this.emitRunEvent();
  }

  private delete = (): void => {
    this.deleted = true;

    this.emitDeleteEvent();
  }

  private updateVisibilityBtnIcon() {
    const { visibilityBtn } = this.componentDomsPackage;

    visibilityBtn.classList.toggle("opacityBlack");
    visibilityBtn.classList.toggle("opacityBlackZero");
  }
}

export {
  Component,
  IComponentParams,
};
