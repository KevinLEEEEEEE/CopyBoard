import ContentEventEmitter from "../utils/contentEventEmitter";

export default abstract class DomCore {
  private contentEventEmitter: ContentEventEmitter;

  constructor() {
    this.contentEventEmitter = new ContentEventEmitter();
  }

  public abstract getContentContainer(): HTMLElement;

  public emitChangeEvent(node: HTMLElement, params: object): void {
    this.contentEventEmitter.emitChangeEvent(node, params);
  }
}
