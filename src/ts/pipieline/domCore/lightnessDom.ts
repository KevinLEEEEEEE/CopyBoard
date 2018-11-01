import { ILightnessParams } from "../dataCore/paramsInterface/paramsInterface";
import DomCore from "./component/domCore";
import Slider from "./widgets/slider";

const MIN_LIGHTNESS = -100;
const MAX_LIGHTNESS = 100;

export default class LightnessDom extends DomCore {
  private slider: Slider;
  private sliderDom: HTMLElement;
  private params: ILightnessParams = {
    lightness: 0,
  };

  constructor() {
    super();

    this.slider = new Slider(MIN_LIGHTNESS, MAX_LIGHTNESS);

    this.sliderDom = this.slider.getSliderDom();

    this.slider.registerListener(this.updateLightnessParams);
  }

  public delete(): void {
    this.slider.delete();
  }

  public getContentContainer(): HTMLElement {
    return this.sliderDom;
  }

  private updateLightnessParams = (lightness) => {
    this.params.lightness = lightness;

    this.emitChangeEvent(this.sliderDom, this.params);
  }
}
