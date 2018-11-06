import SimpleSlider from "./slider";

const initCustomElements = () => {
  customElements.define("simple-slider", SimpleSlider);
};

export {
  initCustomElements,
  SimpleSlider,
};
