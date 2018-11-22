import { ISaturationParams } from "../dataCore/paramsInterface/paramsInterface";
import DomCore from "./component/domCore";
import Slider from "./widgets/slider";

const MIN_SATURATION = -100;
const MAX_SATURATION = 100;

export default class LightnessDom extends DomCore {
  private slider: Slider;
  private sliderDom: HTMLElement;
  private params: ISaturationParams = {
    value: 0,
  };

  constructor() {
    super();

    this.slider = new Slider(MIN_SATURATION, MAX_SATURATION);

    this.sliderDom = this.slider.getSliderDom();

    this.slider.registerListener(this.updateSaturationParams);
  }

  public delete(): void {
    this.slider.delete();
  }

  public getContentContainer(): HTMLElement {
    return this.sliderDom;
  }

  private updateSaturationParams = (value) => {
    this.params.value = value;

    this.emitChangeEvent(this.sliderDom, this.params);
  }
}
