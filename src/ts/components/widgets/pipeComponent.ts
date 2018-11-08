import Logger from "../../utils/log/log";
import EventElement from "./EventElememt";

interface IPipeComponentDoms {
  component: HTMLDivElement;
  displayBtn: HTMLButtonElement;
  deleteBtn: HTMLButtonElement;
  nameSpan: HTMLSpanElement;
  displayImage: HTMLImageElement;
  noDisplayImage: HTMLImageElement;
  componentContent: HTMLDivElement;
}

export default class PipeComponent extends EventElement {
  static get observedAttributes() { return ["name"]; }

  public name: string;

  private pipeComponentDoms: IPipeComponentDoms;
  private logger: Logger = new Logger();
  private isVisible: boolean = true;
  private isDeleted: boolean = false;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const template = document.getElementById("pipe-component") as HTMLTemplateElement;
    const templateContent = template.content;
    const clonedContent = templateContent.cloneNode(true) as DocumentFragment;

    this.initDomsPackage(clonedContent);

    this.initDataDrivenAttributes();

    this.addTarget(this.pipeComponentDoms.component);

    shadow.appendChild(clonedContent); // the dom cannot be find after appended to shadowDom
  }

  public connectedCallback(): void {
    this.logger.info("Custom element added to page");

    this.attachAllEvents();
  }

  public disconnectedCallback(): void {
    this.logger.info("Custom element removed from page");

    this.removeAllEvents();
  }

  public adoptedCallback(): void {
    this.logger.info("Custom element moved to new page");
  }

  public attributeChangedCallback(name, prev, current): void {
    this.logger.info("Custom element " + name + " changed from " + prev + " to " + current);

    this[name] = current;
  }

  private attachAllEvents(): void {
    this.attachBtnEvents();

    this.attachContentEvents();
  }

  private removeAllEvents(): void {
    this.removeBtnEvents();

    this.removeContentEvents();
  }

  // -----------------------------------------------------------------------------------------

  private initDomsPackage(frag: DocumentFragment): void {
    const component = frag.querySelector(".component") as HTMLDivElement;
    const displayBtn = frag.querySelector(".displayBtn") as HTMLButtonElement;
    const displayImages = displayBtn.querySelectorAll("img");
    const deleteBtn = frag.querySelector(".deleteBtn") as HTMLButtonElement;
    const nameSpan = frag.querySelector(".componentName") as HTMLSpanElement;
    const componentContent = frag.querySelector(".componentContent") as HTMLDivElement;

    this.pipeComponentDoms = {
      component,
      displayBtn,
      deleteBtn,
      nameSpan,
      displayImage: displayImages[0],
      noDisplayImage: displayImages[1],
      componentContent,
    };
  }

  private initDataDrivenAttributes(): void {
    const that = this;

    Reflect.defineProperty(this, "name", {
      get(): string {
        return this._name || "none";
      },

      set(name: string) {
        this._name = name;

        that.updateNameSpan();
      },
    });
  }

  private updateNameSpan(): void {
    const { nameSpan } = this.pipeComponentDoms;

    nameSpan.innerHTML = this.name;
  }

  // -----------------------------------------------------------------------------------------

  private attachBtnEvents(): void {
    const { displayBtn, deleteBtn } = this.pipeComponentDoms;

    displayBtn.addEventListener("click", this.displayToggle, true);

    deleteBtn.addEventListener("click", this.delete, true);
  }

  private removeBtnEvents(): void {
    const { displayBtn, deleteBtn } = this.pipeComponentDoms;

    displayBtn.removeEventListener("click", this.displayToggle, true);

    deleteBtn.removeEventListener("click", this.delete, true);
  }

  private displayToggle = (): void => {
    this.isVisible = !this.isVisible;

    this.updateDisplayBtnIcon();

    this.dispatchDisplayToggledEvent();
  }

  private delete = (): void => {
    this.isDeleted = true;

    this.dispatchDeletedEvent();
  }

  private updateDisplayBtnIcon(): void {
    const { displayImage, noDisplayImage } = this.pipeComponentDoms;

    if (this.isVisible === true) {
      displayImage.classList.remove("noDisplay");
      noDisplayImage.classList.add("noDisplay");
    } else {
      displayImage.classList.add("noDisplay");
      noDisplayImage.classList.remove("noDisplay");
    }
  }

  private dispatchDisplayToggledEvent(): void {
    this.dispatchCustomEvent("displayToggle", {
      isVisible: this.isVisible,
    });
  }

  private dispatchDeletedEvent(): void {
    this.dispatchCustomEvent("delete", null);
  }

  // -----------------------------------------------------------------------------------------

  private attachContentEvents(): void {
    const { componentContent } = this.pipeComponentDoms;

    componentContent.addEventListener("changed", this.contentChanged, true);
  }

  private removeContentEvents(): void {
    const { componentContent } = this.pipeComponentDoms;

    componentContent.removeEventListener("changed", this.contentChanged, true);
  }

  private contentChanged = (e: Event) => {
    if (this.isVisible === false || this.isDeleted === true) {
      e.stopPropagation();
    }
  }
}
