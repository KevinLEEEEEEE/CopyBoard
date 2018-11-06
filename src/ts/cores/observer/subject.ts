import IObserver from "./Observer";

export default class Subject {
  protected IObservers: Set<IObserver> = new Set();

  /**
   * add IObserver to list
   * @param observer
   */
  public attach(observer: IObserver): void {
    this.IObservers.add(observer);
  }

  /**
   * remove IObserver from list
   * @param observer
   */
  public detach(observer: IObserver): void {
    this.IObservers.delete(observer);
  }

  /**
   * is obserber in the list
   * @param observer
   */
  public has(observer: IObserver): boolean {
    return this.IObservers.has(observer);
  }

  /**
   * notify all IObservers by running 'update()'
   */
  public notifyObservers(): void {
    this.IObservers.forEach((observer) => {
      observer.update();
    });
  }
}
