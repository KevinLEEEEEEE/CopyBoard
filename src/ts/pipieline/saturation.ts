import SaturationData from "./dataCore/saturationData";
import Component from "./domCore/component/component";
import SaturationDom from "./domCore/saturationDom";

export default class Lightness extends Component {
  constructor(id: symbol, parentNode: HTMLElement) {
    super(id, "saturation", parentNode);

    const saturationData = new SaturationData();

    const saturationDom = new SaturationDom();

    this.init(saturationData, saturationDom);
  }
}
