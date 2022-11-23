import * as math from "mathjs";

export class Facet {
  constructor(
    public points: math.Matrix[],
    public normal: math.Matrix,
    public color: string,
  ) {}

  rotated(rotAxis: math.Matrix, angle: number): Facet {
    return new Facet(
      this.points.map(point => math.rotate(point, angle, rotAxis)),
      math.rotate(this.normal, angle, rotAxis),
      this.color,
    );
  }

  rotate(rotAxis: math.Matrix, angle: number) {
    this.points = this.points.map(point => math.rotate(point, angle, rotAxis));
    this.normal = math.rotate(this.normal, angle, rotAxis);
  }
}
