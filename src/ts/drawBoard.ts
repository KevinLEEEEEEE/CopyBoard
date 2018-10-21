import Board from './board';

interface painter {
  getColor();

  setColor();

  draw();

  erase();

  fill();
}

export default class DrawBoard extends Board implements painter {
  private color: Array<number>;

  constructor() {
    super()
  }

  getColor(): Array<number> {
    return this.color;
  }

  setColor() {

  }

  draw() {

  }

  erase() {

  }

  fill() {
    
  }
}