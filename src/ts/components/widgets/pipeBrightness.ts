export default class PipeBrightness extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const template = document.getElementById("pipe-brightness") as HTMLTemplateElement;
    const templateContent = template.content;
    const clonedContent = templateContent.cloneNode(true) as DocumentFragment;

    shadow.appendChild(clonedContent); // the dom cannot be find after appended to shadowDom
  }
}
