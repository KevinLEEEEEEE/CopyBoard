import Logger from "../../utils/log/log";
import EventElement from "./EventElememt";

interface ISimpleSliderDoms {
  slider: HTMLDivElement;
  sliderBar: HTMLDivElement;
  sliderBlock: HTMLButtonElement;
}

interface ISimpleSliderDomsRect {
  sliderBar: ClientRect;
  sliderBlock: ClientRect;
}

interface IMouseOffsetPosition {
  offsetX: number;
  offsetY: number;
}

class SimpleSlider extends EventElement {
  static get observedAttributes() { return ["value", "min", "max"]; }

  private simpleSliderDomsRect: ISimpleSliderDomsRect = { sliderBar: null, sliderBlock: null };
  private simpleSliderDoms: ISimpleSliderDoms;
  private mouseOffsetPosition: IMouseOffsetPosition;
  private logger: Logger = new Logger();
  private widthOfSliderBar: number;
  private leftOfSliderBlock: number;
  private valueOfSlider: number;
  private minOfSlider: number;
  private maxOfSlider: number;
  private canMove: boolean = false;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "closed" });

    const template = document.getElementById("simple-slider") as HTMLTemplateElement;
    const templateContent = template.content;
    const clonedContent = templateContent.cloneNode(true) as DocumentFragment;

    this.initDomsPackage(clonedContent);

    this.initDataDrivenAttributes();

    this.addTatget(this.simpleSliderDoms.slider);

    shadow.appendChild(clonedContent); // the dom cannot be find after appended
  }

  public get value(): number {
    return this.valueOfSlider;
  }

  public set value(value: number) {
    this.valueOfSlider = value;
  }

  public get min(): number {
    return this.minOfSlider;
  }

  public set min(min: number) {
    this.minOfSlider = min;
  }

  public get max(): number {
    return this.maxOfSlider;
  }

  public set max(max: number) {
    this.maxOfSlider = max;
  }

  // -----------------------------------------------------------------------------------------

  public connectedCallback(): void {
    this.logger.info("Custom element added to page");

    this.attachSliderEvents();

    this.attachUtilsEvents();

    this.updateSimpleSliderDomsClientRect();

    this.updateRendering();
  }

  public disconnectedCallback(): void {
    this.logger.info("Custom element removed from page");

    this.updateRendering();
  }

  public adoptedCallback(): void {
    this.logger.info("Custom element moved to new page");

    this.updateSimpleSliderDomsClientRect();

    this.updateRendering();
  }

  public attributeChangedCallback(name, prev, current): void {
    this.logger.info("Custom element attribute changed from " + prev + " to " + current);

    this.valudateAndUpdateAttribute(name, current);
  }

  // -----------------------------------------------------------------------------------------

  private valudateAndUpdateAttribute(name: string, value: string): void {
    const parsed = parseInt(value, 10);

    if (this.isValidNumber(parsed) === true) {
      this.updateAttribute(name, parsed);
    }
  }

  private isValidNumber(num: number): boolean {
    return !isNaN(num);
  }

  private updateAttribute(name: string, value: number): void {
    switch (name) {
      case "value":
        this.valueOfSlider = value;
        break;
      case "max":
        this.maxOfSlider = value;
        break;
      case "min":
        this.minOfSlider = value;
        break;
      default:
    }
  }

  private initDomsPackage(frag: DocumentFragment): void {
    const slider = frag.querySelector(".slider") as HTMLDivElement;
    const sliderBar = slider.querySelector(".sliderBar") as HTMLDivElement;
    const sliderBlock = sliderBar.querySelector(".sliderBlock") as HTMLButtonElement;

    this.simpleSliderDoms = {
      slider,
      sliderBar,
      sliderBlock,
    };
  }

  // -----------------------------------------------------------------------------------------

  private initDataDrivenAttributes(): void {
    const that = this;

    Reflect.defineProperty(this, "valueOfSlider", {
      get(): number {
        return this._valueOfSlider || 0;
      },

      set(value: number) {
        this._valueOfSlider = that.getValidValue(value);

        that.updateRendering();
      },

      configurable: false,
      enumerable: false,
    });

    Reflect.defineProperty(this, "minOfSlider", {
      get(): number {
        return this._minOfSlider || 0;
      },

      set(min: number) {
        this._minOfSlider = that.getValidMin(min);

        that.recalculateAttributes();
      },

      configurable: false,
      enumerable: false,
    });

    Reflect.defineProperty(this, "maxOfSlider", {
      get(): number {
        return this._maxOfSlider;
      },

      set(max: number) {
        this._maxOfSlider = that.getValidMax(max);

        that.recalculateAttributes();
      },

      configurable: false,
      enumerable: false,
    });
  }

  private getValidValue(value: number): number {
    if (value > this.maxOfSlider) {
      return this.maxOfSlider;
    } else if (value < this.minOfSlider) {
      return this.minOfSlider;
    } else {
      return value;
    }
  }

  private getValidMin(min: number): number {
    if (min > this.maxOfSlider) {
      return this.maxOfSlider;
    } else {
      return min;
    }
  }

  private getValidMax(max: number): number {
    if (max < this.minOfSlider) {
      return this.minOfSlider;
    } else {
      return max;
    }
  }

  private recalculateAttributes(): void {
    const total = this.maxOfSlider - this.minOfSlider;
    const percentage = this.leftOfSliderBlock / this.widthOfSliderBar;
    const value = total * percentage + this.minOfSlider;

    if (this.isValidNumber(value) === true) {
      this.valueOfSlider = value;

      // this.logger.info("current value: " + value);
    }
  }

  private updateRendering(): void {
    const value = this.valueOfSlider;
    const total = this.maxOfSlider - this.minOfSlider;
    const percentage = (value - this.minOfSlider) / total;
    const left = this.widthOfSliderBar * percentage;

    if (this.isValidNumber(left) === true) {
      this.leftOfSliderBlock = left;

      this.updateSliderBlockNodeXPosition();

      // this.logger.info("current node position percentage: " + percentage);
    }
  }

  // -----------------------------------------------------------------------------------------

  private attachSliderEvents(): void {
    const { sliderBar, sliderBlock } = this.simpleSliderDoms;

    sliderBlock.addEventListener("mousedown", this.mousedown, true);

    sliderBlock.addEventListener("mousemove", this.mousemove, true);

    sliderBlock.addEventListener("mouseup", this.mouseup, true);

    sliderBar.addEventListener("mousemove", this.mousemove, true);
  }

  private mousedown = (e): void => {
    const { target, offsetX, offsetY } = e;

    if (!this.canAcceptMouseDown(target)) {
      return;
    }

    this.updateMousePosition(offsetX, offsetY);

    this.canMove = true;
  }

  private canAcceptMouseDown(target: HTMLElement): boolean {
    return this.simpleSliderDoms.sliderBlock.isSameNode(target) && this.canMove === false;
  }

  private updateMousePosition(offsetX: number, offsetY: number): void {
    this.mouseOffsetPosition = { offsetX, offsetY };
  }

  private mousemove = (e): void => {
    const { pageX, buttons } = e;

    if (!this.canAcceptMouseMove()) {
      return;
    }

    if (!this.canContinueMouseMove(buttons)) {
      this.mouseup(); // if you loose the left mouse button, then stop moving

      return;
    }

    this.mousemoveForMove(pageX);
  }

  private canAcceptMouseMove(): boolean {
    return this.canMove === true;
  }

  private canContinueMouseMove(buttons: number) {
    return buttons === 1;
  }

  private mousemoveForMove(pageX): void {
    const currentXPosition = pageX - this.simpleSliderDomsRect.sliderBar.left - this.mouseOffsetPosition.offsetX;

    if (!this.isSliderBlockInTheScopeOfSliderBar(currentXPosition)) {
      return;
    }

    this.leftOfSliderBlock = currentXPosition;

    this.updateSliderBlockNodeXPosition();

    this.recalculateAttributes();
  }

  private isSliderBlockInTheScopeOfSliderBar(currentXPosition: number): boolean {
    const sliderBlockWidth = this.simpleSliderDomsRect.sliderBlock.width;
    const sliderBarWidth = this.simpleSliderDomsRect.sliderBar.width;

    return currentXPosition >= 0 && currentXPosition + sliderBlockWidth <= sliderBarWidth;
  }

  private updateSliderBlockNodeXPosition(): void {
    const { sliderBlock } = this.simpleSliderDoms;

    window.requestAnimationFrame(() => {
      sliderBlock.style.left = this.leftOfSliderBlock + "px";
    });
  }

  private mouseup = (): void => {
    this.canMove = false;

    this.recalculateAttributes();

    this.dispatchCustomEvent("changed", { // restructure required
      value: this.valueOfSlider,
    });
  }

  // -----------------------------------------------------------------------------------------

  private attachUtilsEvents(): void {
    const { sliderBar, sliderBlock } = this.simpleSliderDoms;

    sliderBar.addEventListener("resize", this.sliderBarResize, true);

    sliderBlock.addEventListener("resize", this.sliderBlockResize, true);
  }

  private updateSimpleSliderDomsClientRect(): void {
    this.sliderBarResize();

    this.sliderBlockResize();
  }

  private sliderBarResize = (): void => {
    const { sliderBar } = this.simpleSliderDoms;

    this.simpleSliderDomsRect.sliderBar = sliderBar.getBoundingClientRect();

    this.updateSliderDomsSizeAttributes();
  }

  private sliderBlockResize = (): void => {
    const { sliderBlock } = this.simpleSliderDoms;

    this.simpleSliderDomsRect.sliderBlock = sliderBlock.getBoundingClientRect();

    this.updateSliderDomsSizeAttributes();
  }

  private updateSliderDomsSizeAttributes(): void {
    const { sliderBar, sliderBlock } = this.simpleSliderDomsRect;
    const widthOfSliderBar = sliderBar !== null ? sliderBar.width : 0;
    const widthOfSliderBlock = sliderBlock !== null ? sliderBlock.width : 0;

    this.widthOfSliderBar = widthOfSliderBar - widthOfSliderBlock;
  }
}

export default SimpleSlider;
