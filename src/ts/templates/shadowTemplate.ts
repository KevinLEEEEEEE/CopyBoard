import createAndAppend from "../utils/createAndAppend";

interface IShadowTemplate {
  shadowBoard: HTMLCanvasElement;
}

const shadowTemplate = (): IShadowTemplate => {
  const shadowBoard: HTMLCanvasElement = createAndAppend<HTMLCanvasElement>(null, "canvas");

  return { shadowBoard };
};

export {
  shadowTemplate,
  IShadowTemplate,
};
