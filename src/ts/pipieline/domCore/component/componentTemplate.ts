import createAndAppend from "../utils/createAndAppend";

interface IComponentTemplate {
  component: HTMLDivElement;
  componentContent: HTMLDivElement;
  visibilityBtn: HTMLButtonElement;
  deleteBtn: HTMLButtonElement;
}

const componentTemplate = (name: string): IComponentTemplate => {
  const component: HTMLDivElement = createAndAppend<HTMLDivElement>(null, "div", "component");

  const componentController: HTMLDivElement = createAndAppend<HTMLDivElement>(component, "div", "componentController");
  const componentContent: HTMLDivElement = createAndAppend<HTMLDivElement>(component, "div", "componentContent");

  const div1: HTMLDivElement = createAndAppend<HTMLDivElement>(componentController, "div");
  const div2: HTMLDivElement = createAndAppend<HTMLDivElement>(componentController, "div");

  const visibilityBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div1, "button", "opacityBlack");
  const nameSpan: HTMLElement = createAndAppend<HTMLElement>(div1, "span");

  nameSpan.innerHTML = name;

  const deleteBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div2, "button", "deleteBlack");

  return {
    component,
    componentContent,
    visibilityBtn,
    deleteBtn,
  };
};

export {
  IComponentTemplate,
  componentTemplate,
};
