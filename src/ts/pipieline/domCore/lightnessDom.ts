import { ILightnessParams } from "../dataCore/paramsInterface/paramsInterface";
import DomCore from "./component/domCore";
import Slider from "./widgets/slider";

const MIN_LIGHTNESS = -100;
const MAX_LIGHTNESS = 100;

export default class LightnessDom extends DomCore {
  private slider;
  private params: ILightnessParams = {
    value: 0,
  };

  constructor() {
    super();

    this.slider = document.createElement("pipe-brightness");

    // this.slider = new Slider(MIN_LIGHTNESS, MAX_LIGHTNESS);

    // this.sliderDom = this.slider;

    // this.slider.registerListener(this.updateLightnessParams);
  }

  public delete(): void {
    // this.slider.delete();

    console.log("delete");
  }

  public getContentContainer(): HTMLElement {
    return this.slider;
  }

  private updateLightnessParams = (value) => {
    this.params.value = value;

    this.emitChangeEvent(this.slider, this.params);
  }
}
