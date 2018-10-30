import LightnessData from "./dataCore/lightnessData";
import { Component } from "./domCore/component";
import LightnessDom from "./domCore/lightnessDom";

export default class Lightness extends Component {
  constructor(id: symbol, parentNode: HTMLElement) {
    super(id, "lightness", parentNode);

    const lightnessData = new LightnessData();

    const lightnessDom = new LightnessDom();

    this.init(lightnessData, lightnessDom);
  }
}
