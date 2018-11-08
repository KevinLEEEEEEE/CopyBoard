import PipeComponent from "./pipeComponent";
import SimpleSlider from "./slider";

import PipeBrightness from "./pipeBrightness";

const initCustomElements = () => {
  customElements.define("simple-slider", SimpleSlider);

  customElements.define("pipe-component", PipeComponent);

  customElements.define("pipe-brightness", PipeBrightness);
};

export {
  initCustomElements,
  SimpleSlider,
  PipeComponent,
  PipeBrightness,
};
