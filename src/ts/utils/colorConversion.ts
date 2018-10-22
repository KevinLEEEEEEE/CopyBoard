export default class ColorConversion {
  public rgbToHex(r: number, g: number, b: number): string {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  public hexToRgb(hex: string): number[] {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ] : [];
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);

    return hex.length === 1 ? "0" + hex : hex;
  }
}
