interface IColorDialTemplate {
  colorDial: HTMLDivElement;
  colorInputL: HTMLInputElement;
  colorInputR: HTMLInputElement;
}

const createAndAppend = <T>(parent: HTMLElement, nodeType: string = "div", ...klass: string[]): T => {
  const node: any = document.createElement(nodeType);

  if (klass !== null) {
    klass.forEach((klas) => {
      node.classList.add(klas);
    });
  }

  if (parent !== null) {
    parent.appendChild(node);
  }

  return node;
};

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
  createAndAppend,
  colorDialTemplate,
  IColorDialTemplate,
};
