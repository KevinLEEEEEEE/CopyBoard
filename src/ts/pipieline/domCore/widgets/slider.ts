import Logger from "../../../utils/log/log";
import { ISliderTemplate, sliderTemplate } from "./sliderTemplate";

export default class Slider {
  private sliderDomsPackage: ISliderTemplate;
  private clickPageX: number = 0;
  private sliderBarOffsetX: number = 0;
  private sliderBarWidth: number = 0;
  private sliderLineOffsetX: number = 0;
  private sliderLineWidth: number = 0;
  private canMove: boolean = false;
  private isChanged: boolean = false;
  private prevValue: number;
  private listeners: any[] = [];
  private logger: Logger;
  private min: number;
  private max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;

    this.logger = new Logger();

    this.sliderDomsPackage = sliderTemplate(min.toString(), max.toString());

    this.attachSlideEvents();
  }

  public getSliderDom(): HTMLDivElement {
    return this.sliderDomsPackage.slider;
  }

  public registerListener(func): void {
    this.listeners.push(func);
  }

  private calculateValueAndNotify(): void {
    if(this.isChanged === false) {
      return;
    }

    this.updateNodeSize();

    const value = this.getCurrentValue();

    if (value === this.prevValue) {
      return;
    }

    this.prevValue = value;

    this.listeners.forEach((listener) => {
      listener(value);
    })
  }

  private attachSlideEvents = (): void => {
    const { slider, sliderBar } = this.sliderDomsPackage;

    sliderBar.addEventListener("mousedown", this.mousedown, true);

    slider.addEventListener("mousemove", this.mousemove, true);

    slider.addEventListener("mouseup", this.mouseup, true);

    slider.addEventListener("mouseleave", this.mouseleave, true);
  }

  private mousedown = (e): void => {
    this.canMove = true;

    this.updateMousePosition(e);

    this.updateNodeSize();
  }

  private mousemove = (e): void => {
    if (this.canMove === true) {
      this.isChanged = true;

      this.mousemoveForMove(e);
    }
  }

  private mouseup = (): void => {
    this.canMove = false;

    this.calculateValueAndNotify();
  }

  private mouseleave = (e): void => {
    const { sliderBar } = this.sliderDomsPackage;

    if (!sliderBar.isSameNode(e.originalTarget)) {
      this.canMove = false;

      this.calculateValueAndNotify();
    }
  }

  private updateMousePosition(e): void {
    const { pageX } = e;

    this.clickPageX = pageX;
  }

  private updateNodeSize(): void {
    const { sliderBar, sliderLine } = this.sliderDomsPackage;
    const barRect = sliderBar.getBoundingClientRect();
    const lineRect = sliderLine.getBoundingClientRect();

    this.sliderBarOffsetX = barRect.left;
    this.sliderBarWidth = barRect.width;
    this.sliderLineOffsetX = lineRect.left;
    this.sliderLineWidth = lineRect.width;
  }

  private mousemoveForMove(e): void {
    const { pageX } = e;

    const offset = this.sliderBarOffsetX - this.sliderLineOffsetX;
    const x: number = pageX - this.clickPageX + offset;

    if (this.canAcceptMouseMove(x)) {
      this.updateNodePosition(this.sliderDomsPackage.sliderBar, x);
    }
  }

  private canAcceptMouseMove(x: number): boolean {
    return x >= -this.sliderBarWidth / 2 && x <= (this.sliderLineWidth - this.sliderBarWidth / 2);
  }

  private updateNodePosition(node: HTMLElement, x: number): void {
    window.requestAnimationFrame(() => {
      node.style.left = x + "px";
    });
  }

  private getCurrentValue(): number {
    const total = this.max - this.min;
    const currentCenter = this.sliderLineOffsetX + this.sliderLineWidth / 2;
    const currentPoint =  this.sliderBarOffsetX + this.sliderBarWidth / 2;
    const currentPercentage = (currentPoint - currentCenter) / this.sliderLineWidth;
    const currentValue = total * currentPercentage;

    return Math.round(currentValue);
  }
}
