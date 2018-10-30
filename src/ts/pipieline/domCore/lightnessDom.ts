import Slider from "./widgets/slider";
import ContentEventEmitter from "./contentEventEmitter";
import { IDomCore } from "../domCore/component";

const MIN_LIGHTNESS = -100;
const MAX_LIGHTNESS = 100;

export default class LightnessDom implements IDomCore {
  private slider: Slider;
  private lightness: number;
  private contentEventEmitter: ContentEventEmitter;

  constructor() {
    this.slider = new Slider(MIN_LIGHTNESS, MAX_LIGHTNESS);

    this.slider.registerListener(this.updateLightnessParams);

    this.contentEventEmitter = new ContentEventEmitter(this.slider.getSliderDom());
  }

  public getContentContainer(): HTMLElement {
    return this.slider.getSliderDom();
  }

  private updateLightnessParams = (lightness) => {
    this.lightness = lightness;

    console.log(lightness);

    const params = {
      lightness,
    }

    this.contentEventEmitter.emitChangeEvent(params);
  }
}
