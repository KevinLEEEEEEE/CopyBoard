import LightnessData from "./dataCore/lightnessData";
import Component from "./domCore/component/component";
import LightnessDom from "./domCore/lightnessDom";

export default class Lightness extends Component {
  constructor(id: symbol, parentNode: HTMLElement) {
    super(id, "lightness", parentNode);

    const lightnessData = new LightnessData();

    const lightnessDom = document.createElement("pipe-brightness");

    this.init(lightnessData, lightnessDom);
  }
}
