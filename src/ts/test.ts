interface IPoint {
  readonly x: number;
}

export default class Test {
  public Add(a: number, b: number): number {
    return a + b;
  }

  public Test() {
    const numberArray: number[] = [1, 2, 3];
    const p1: IPoint = { x : 5 };

  }

  public identify<T>(arg: T): T {
    return arg;
  }
}
