import createAndAppend from "../utils/createAndAppend";

interface ISliderTemplate {
  slider: HTMLDivElement;
  sliderBar: HTMLButtonElement;
  sliderLine: HTMLDivElement;
}

const sliderTemplate = (sliderMin: string, sliderMax: string): ISliderTemplate => {
  const slider: HTMLDivElement = createAndAppend<HTMLDivElement>(null, "div", "slider");

  const pMin: HTMLElement = createAndAppend<HTMLElement>(slider, "p", "sliderLimit");

  pMin.innerHTML = sliderMin;

  const sliderController: HTMLDivElement = createAndAppend<HTMLDivElement>(slider, "div", "sliderController");

  const pMax: HTMLElement = createAndAppend<HTMLElement>(slider, "p", "sliderLimit");

  pMax.innerHTML = sliderMax;

  const sliderBar: HTMLButtonElement = createAndAppend<HTMLButtonElement>(sliderController, "button", "sliderBar");

  const sliderLine: HTMLDivElement = createAndAppend<HTMLDivElement>(sliderController, "div", "sliderLine");

  return {
    slider,
    sliderBar,
    sliderLine,
  };
};

export {
  ISliderTemplate,
  sliderTemplate,
};
