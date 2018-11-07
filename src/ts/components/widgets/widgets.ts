import PipeComponent from "./pipeComponent";
import SimpleSlider from "./slider";

const initCustomElements = () => {
  customElements.define("simple-slider", SimpleSlider);

  customElements.define("pipe-component", PipeComponent);
};

export {
  initCustomElements,
  SimpleSlider,
};
