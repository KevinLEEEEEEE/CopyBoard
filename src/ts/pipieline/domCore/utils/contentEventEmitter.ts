export default class ContentEventEmitter {
  public emitChangeEvent(node: HTMLElement, params: object): void {
    const eventDict = {
      detail: params,
      bubbles: true,
      cancelable: false,
      composed: false,
    };

    const changeEvent = new CustomEvent("change", eventDict);

    node.dispatchEvent(changeEvent);
  }
}
