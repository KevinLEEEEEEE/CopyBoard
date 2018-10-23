import createAndAppend from '../utils/createAndAppend';

interface IColorDialTemplate {
  colorDial: HTMLDivElement;
  colorInputL: HTMLInputElement;
  colorInputR: HTMLInputElement;
}

const colorDialTemplate = (): IColorDialTemplate => {
  const colorDial: HTMLDivElement = createAndAppend<HTMLDivElement>(null, "div", "colorDial");

  const div: HTMLDivElement = createAndAppend<HTMLDivElement>(colorDial, "div");

  const colorContainerL: HTMLDivElement = createAndAppend<HTMLDivElement>(div, "div", "colorContainer");
  const colorContainerR: HTMLDivElement = createAndAppend<HTMLDivElement>(div, "div", "colorContainer");

  const colorInputL: HTMLInputElement = createAndAppend<HTMLInputElement>(colorContainerL, "input");
  const colorInputR: HTMLInputElement = createAndAppend<HTMLInputElement>(colorContainerR, "input");

  colorInputL.setAttribute("type", "color");
  colorInputR.setAttribute("type", "color");

  return { colorDial, colorInputL, colorInputR };
};

export {
  colorDialTemplate,
  IColorDialTemplate,
};
