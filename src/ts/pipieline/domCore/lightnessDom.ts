import Slider from "./widgets/slider";

export default class LightnessDom {
  private slider: Slider;

  constructor(min: number, max: number) {
    this.slider = new Slider(min, max);
  }

  public getLightnessDom(): HTMLElement {
    return this.slider.getSliderDom();
  }
}
