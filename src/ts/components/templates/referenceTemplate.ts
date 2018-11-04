import { createAndAppend } from "../utils";

interface IReferenceTemplate {
  referenceBoard: HTMLDivElement;
  cvsContainer: HTMLDivElement;
  nameInput: HTMLInputElement;
  opacityBtn: HTMLButtonElement;
  opacityInput: HTMLInputElement;
  moveUpBtn: HTMLButtonElement;
  moveTopBtn: HTMLButtonElement;
  moveDownBtn: HTMLButtonElement;
  moveBottomBtn: HTMLButtonElement;
  colorPickerBtn: HTMLButtonElement;
  pixelateBtn: HTMLButtonElement;
  pixelateInput: HTMLInputElement;
  lockerBtn: HTMLButtonElement;
  deleteBtn: HTMLButtonElement;
}

const referenceTemplate = (): IReferenceTemplate => {
  const referenceBoard: HTMLDivElement =
    createAndAppend<HTMLDivElement>(null, "div", "board", "referenceBoard", "nonePointerEvents");

  const controller: HTMLDivElement = createAndAppend<HTMLDivElement>(referenceBoard, "div", "boardController");
  const cvsContainer: HTMLDivElement = createAndAppend<HTMLDivElement>(referenceBoard, "div", "boardContent");

  const leftPanel: HTMLDivElement = createAndAppend<HTMLDivElement>(controller, "div", "controlPanel", "leftPanel");
  const rightPanel: HTMLDivElement = createAndAppend<HTMLDivElement>(controller, "div", "controlPanel", "rightPanel");

  const div1: HTMLDivElement = createAndAppend<HTMLDivElement>(leftPanel, "div");
  const nameInput: HTMLInputElement = createAndAppend<HTMLInputElement>(div1, "input", "nameInput");

  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("placeholder", "name");

  const div2: HTMLDivElement = createAndAppend<HTMLDivElement>(leftPanel, "div");
  const opacityBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div2, "button", "opacity");
  const opacityInput: HTMLInputElement = createAndAppend<HTMLInputElement>(div2, "input", "opacityInput", "noDisplay");

  opacityInput.setAttribute("type", "number");

  const div3: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const moveUpBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div3, "button", "moveUp");
  const moveTopBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div3, "button", "moveTop");

  const div4: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const moveDownBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div4, "button", "moveDown");
  const moveBottomBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div4, "button", "moveBottom");

  const div5: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const colorPickerBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div5, "button", "colorPicker");
  const pixelateBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div5, "button", "pixelate");
  const pixelateInput: HTMLInputElement =
    createAndAppend<HTMLInputElement>(div5, "input", "pixelateInput", "noDisplay");

  pixelateInput.setAttribute("type", "number");
  pixelateInput.setAttribute("placeholder", "1");

  const div6: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const lockerBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div6, "button", "locke", "unlock");
  const deleteBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div6, "button", "delete");

  return {
    referenceBoard,
    cvsContainer,
    nameInput,
    opacityBtn,
    opacityInput,
    moveUpBtn,
    moveTopBtn,
    moveDownBtn,
    moveBottomBtn,
    colorPickerBtn,
    pixelateBtn,
    pixelateInput,
    lockerBtn,
    deleteBtn,
  };
};

export {
  referenceTemplate,
  IReferenceTemplate,
};
