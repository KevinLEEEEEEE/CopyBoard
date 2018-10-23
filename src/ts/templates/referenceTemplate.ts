import createAndAppend from '../utils/createAndAppend';

interface IReferenceTemplate {
  referenceBoard: HTMLDivElement;
  content: HTMLDivElement;
  nameInput: HTMLInputElement;
  opacityBtn: HTMLButtonElement;
  moveUpBtn: HTMLButtonElement;
  moveTopBtn: HTMLButtonElement;
  moveDownBtn: HTMLButtonElement;
  moveBottomBtn: HTMLButtonElement;
  colorSelectorBtn: HTMLButtonElement;
  binBtn: HTMLButtonElement;
  lockerBtn: HTMLButtonElement;
  deleteBtn: HTMLButtonElement;
}

const referenceTemplate = (): IReferenceTemplate => {
  const referenceBoard: HTMLDivElement = createAndAppend<HTMLDivElement>(null, "div", "board", "referenceBoard", "nonePointerEvents");

  const controller: HTMLDivElement = createAndAppend<HTMLDivElement>(referenceBoard, "div", "boardController");
  const content: HTMLDivElement = createAndAppend<HTMLDivElement>(referenceBoard, "div", "boardContent");

  const leftPanel: HTMLDivElement = createAndAppend<HTMLDivElement>(controller, "div", "controlPanel", "leftPanel");
  const rightPanel: HTMLDivElement = createAndAppend<HTMLDivElement>(controller, "div", "controlPanel", "rightPanel");

  const div1: HTMLDivElement = createAndAppend<HTMLDivElement>(leftPanel, "div");
  const nameInput: HTMLInputElement = createAndAppend<HTMLInputElement>(div1, "input");

  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("placeholder", "name");

  const div2: HTMLDivElement = createAndAppend<HTMLDivElement>(leftPanel, "div");
  const opacityBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div2, "button", "opacity");

  opacityBtn.innerHTML = "opacity";

  const div3: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const moveUpBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div3, "button", "moveUp");
  const moveTopBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div3, "button", "moveTop");

  const div4: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const moveDownBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div4, "button", "moveDown");
  const moveBottomBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div4, "button", "moveBottom");

  const div5: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const colorSelectorBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div5, "button", "colorSelector");
  const binBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div5, "button", "bin");

  const div6: HTMLDivElement = createAndAppend<HTMLDivElement>(rightPanel, "div");
  const lockerBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div6, "button", "locker");
  const deleteBtn: HTMLButtonElement = createAndAppend<HTMLButtonElement>(div6, "button", "delete");

  deleteBtn.innerHTML = "delete";

  moveUpBtn.innerHTML = "up";
  moveTopBtn.innerHTML = "top";
  moveDownBtn.innerHTML = "down";
  moveBottomBtn.innerHTML = "bottom";

  return {
    referenceBoard,
    content,
    nameInput,
    opacityBtn,
    moveUpBtn,
    moveTopBtn,
    moveDownBtn,
    moveBottomBtn,
    colorSelectorBtn,
    binBtn,
    lockerBtn,
    deleteBtn,
  };
};

export {
  referenceTemplate,
  IReferenceTemplate,
};
