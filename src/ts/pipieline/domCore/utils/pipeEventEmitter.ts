export default class PipeEventEmitter {
  private node: HTMLElement;
  private id: symbol;
  private runEvent: CustomEvent;
  private deleteEvent: CustomEvent;

  constructor(node: HTMLElement, id: symbol) {
    this.node = node;

    this.id = id;

    this.createPipeEvents();
  }

  public emitRunEvent(): void {
    this.node.dispatchEvent(this.runEvent);
  }

  public emitDeleteEvent(): void {
    this.node.dispatchEvent(this.deleteEvent);
  }

  private createPipeEvents(): void {
    const eventDict = {
      detail: {
        id: this.id,
      },
      bubbles: true,
      cancelable: false,
      composed: false,
    };

    this.runEvent = new CustomEvent("run", eventDict);

    this.deleteEvent = new CustomEvent("delete", eventDict);
  }
}
