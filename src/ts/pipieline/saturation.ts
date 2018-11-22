import SaturationData from "./dataCore/saturationData";
import Component from "./domCore/component/component";
import SaturationDom from "./domCore/saturationDom";

export default class Lightness extends Component {
  constructor(id: symbol, parentNode: HTMLElement) {
    super(id, "saturation", parentNode);

    const saturationData = new SaturationData();

    const saturationDom = document.createElement("pipe-brightness");

    this.init(saturationData, saturationDom);
  }
}
