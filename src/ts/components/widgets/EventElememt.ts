export default class EventElement extends HTMLElement {
  private targets: Set<HTMLElement> = new Set();

  constructor() {
    super();
  }

  protected addTatget(node: HTMLElement): void {
    this.targets.add(node);
  }

  protected removeTatget(node: HTMLElement): void {
    this.targets.delete(node);
  }

  protected hasTarget(node: HTMLElement): boolean {
    return this.targets.has(node);
  }

  protected dispatchCustomEvent(name: string, detail: object): void {
    const event = new CustomEvent(name, {
      detail,
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    this.dispatedEventOnTargets(event);
  }

  private dispatedEventOnTargets(event: CustomEvent): void {
    this.targets.forEach((target) => {
      target.dispatchEvent(event);
    });
  }
}
