export default function createAndAppend<T>(parent: HTMLElement, nodeType: string = "div", ...klass: string[]): T {
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
}
