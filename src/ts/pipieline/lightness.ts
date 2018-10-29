import Logger from "../utils/log/log";
import LightnessData from "./dataCore/lightnessData";
import { Component, IComponentParams } from "./domCore/component";
import LightnessDom from "./domCore/lightnessDom";

const MIN_LIGHTNESS = -100;
const MAX_LIGHTNESS = 100;

export default class Lightness extends Component {
  private lightnessData: LightnessData;
  private lightnessDom: LightnessDom;
  private logger: Logger;

  constructor(id: symbol, parentNode: HTMLElement) {
    super(id, "lightness", parentNode);

    this.lightnessData = new LightnessData();

    this.lightnessDom = new LightnessDom(MIN_LIGHTNESS, MAX_LIGHTNESS);

    this.logger = new Logger();

    this.init();
  }

  public getParams(): object {
    return {};
  }

  public run({ imageData, isChanged, inheritParams }: IComponentParams): Promise<IComponentParams> {
    if (this.isVisible() === false) {
      return Promise.resolve({ imageData, isChanged });
    }

    if (this.isDeleted() === true) {
      this.removeSelfFromParentNode();

      return Promise.resolve({ imageData, isChanged: true });
    }

    const params = this.getCombinedParams(inheritParams);

    return this.lightnessData.getComputedImageData(imageData, params)
      .then((computedImageData) => {
        return Promise.resolve({ imageData: computedImageData, isChanged: true });
      }, (err) => {
        this.logger.error(err);

        return Promise.resolve({ imageData, isChanged });
      })
      .catch((err) => {
        this.logger.error(err);

        return Promise.resolve({ imageData, isChanged });
      });
  }

  private init(): void {
    this.appendSelfToParentNode();

    const content = this.lightnessDom.getLightnessDom();

    this.setContentNode(content);
  }

  private getCombinedParams(inhertParams) {
    return {
      lightness: 2,
    };
  }
}
