import { ISliderTemplate, sliderTemplate } from "./sliderTemplate";

export default class Slider {
  private sliderDomsPackage: ISliderTemplate;
  private min: number;
  private max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;

    this.sliderDomsPackage = sliderTemplate(min.toString(), max.toString());

    this.attachSlideEvents();
  }

  public getSliderDom(): HTMLDivElement {
    return this.sliderDomsPackage.slider;
  }

  private attachSlideEvents = (): void => {
    const { sliderBar } = this.sliderDomsPackage;
  }
}
