export default class ColorChangeEventEmitter {
  private node: HTMLElement;

  constructor(node: HTMLElement) {
    this.node = node;
  }

  public emitColorChangeEvents(rgba: number[]): void {
    const eventDict = {
      detail: {
        rgba,
      },
      bubbles: true,
      cancelable: false,
      composed: false,
    };

    const colorChangeEvent = new CustomEvent("colorChange", eventDict);

    this.node.dispatchEvent(colorChangeEvent);
  }
}
