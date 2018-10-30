export default class ContentEventEmitter {
  private node: HTMLElement;

  constructor(node: HTMLElement) {
    this.node = node;
  }

  public emitChangeEvent(params: object): void {
    const eventDict = {
      detail: params,
      bubbles: true,
      cancelable: false,
      composed: false,
    };

    const changeEvent = new CustomEvent("change", eventDict);

    this.node.dispatchEvent(changeEvent);
  }
}