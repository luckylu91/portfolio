import * as math from "mathjs";

export class Facet {
  constructor(
    public points: math.Matrix[],
    public normal: math.Matrix,
    public color: string,
  ) {}

  clone(): Facet {
    return new Facet(
      this.points.map(m => math.clone(m)),
      math.clone(this.normal),
      this.color
    );
  }

  rotateInto(dest: Facet, rotAxis: math.Matrix, angle: number) {
    dest.points = this.points.map(point => math.rotate(point, angle, rotAxis));
    dest.normal = math.rotate(this.normal, angle, rotAxis);
  }

  copyInto(dest: Facet) {
    dest.points = this.points.map(m => math.clone(m));
    dest.normal = math.clone(this.normal);
  }

  rotate(rotAxis: math.Matrix, angle: number) {
    this.points = this.points.map(point => math.rotate(point, angle, rotAxis));
    this.normal = math.rotate(this.normal, angle, rotAxis);
  }
}
