import createAndAppend from "../utils/createAndAppend";

interface ICanvasTemplate {
  canvasBoard: HTMLDivElement;
  cvsContainer: HTMLDivElement;
  nameInput: HTMLInputElement;
  opacityBtn: HTMLButtonElement;
  opacityInput: HTMLInputElement;
  moveBtn: HTMLButtonElement;
  penBtn: HTMLButtonElement;
  eraserBtn: HTMLButtonElement;
  colorPickerBtn: HTMLButtonElement;
  bucketBtn: HTMLButtonElement;
  lockerBtn: HTMLButtonElement;
  settingBtn: HTMLButtonElement;
}

const canvasTemplate = (): ICanvasTemplate => {
  const canvasBoard: HTMLDivElement =
  createAndAppend<HTMLDivElement>(null, "div", "board", "canvasBoard", "nonePointerEvents");

  const controller: HTMLDivElement = createAndAppend<HTMLDivElement>(canvasBoard, "div", "boardController");
  const cvsContainer: HTMLDivElement = createAndAppend<HTMLDivElement>(canvasBoard, "div", "boardContent");

  const leftPanel: HTMLDivElement = createAndAppend<HTMLDivElement>(controller, "div", "controlPanel", "leftPanel");
  const rightPanel: HTMLDivElement = createAndAppend<HTMLDivElement>(controller, "div", "controlPanel", "rightPanel");

  const div1: HTMLDivElement = createAndAppend<HTMLDivElement>(leftPanel, "div");
  const nameInput: HTMLInputElement = createAndAppend<HTMLInputElement>(div1, "input", "nameInput");

  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("placeholder", "filename");

  const div2: HTMLDivElement = createAndAppend<HTMLDivElement>(leftPanel, "div");
  const opacityBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div2, "button", "opacity");
  const opacityInput: HTMLInputElement = createAndAppend<HTMLInputElement>(div2, "input", "opacityInput", "noDisplay");

  opacityInput.setAttribute("type", "number");

  const div3: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const moveBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div3, "button", "move");

  const div4: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const penBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div4, "button", "pen");
  const eraserBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div4, "button", "eraser");

  const div5: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const colorPickerBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div5, "button", "colorPicker");
  const bucketBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div5, "button", "bucket");

  const div6: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const lockerBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div6, "button", "locke", "unlock");
  const settingBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div6, "button", "setting");

  return {
    canvasBoard,
    cvsContainer,
    nameInput,
    opacityBtn,
    opacityInput,
    moveBtn,
    penBtn,
    eraserBtn,
    colorPickerBtn,
    bucketBtn,
    lockerBtn,
    settingBtn,
  };
};

export {
  canvasTemplate,
  ICanvasTemplate,
};
