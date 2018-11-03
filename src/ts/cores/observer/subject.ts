import Observer from "./observer";

export default class Subject {
  protected observers: Set<Observer> = new Set();

  /**
   * add observer to list
   * @param observer
   */
  public attach(observer: Observer): void {
    this.observers.add(observer);
  }

  /**
   * remove observer from list
   * @param observer
   */
  public detach(observer: Observer): void {
    this.observers.delete(observer);
  }

  /**
   * is obserber in the list
   * @param observer
   */
  public has(observer: Observer): boolean {
    return this.observers.has(observer);
  }

  /**
   * notify all observers by running 'update()'
   */
  public notifyObservers(): void {
    this.observers.forEach((observer) => {
      observer.update();
    });
  }
}
