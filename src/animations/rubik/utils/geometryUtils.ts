import * as math from "mathjs";
import { mainNormals } from "./geometryConstants";

export function addMatrices(...args: math.Matrix[]) {
  return args.reduce((prev: math.Matrix, current: math.Matrix) => math.add(prev, current));
}

export function generateSquare(axis: number, cubeOffsetAxes: number[]): math.Matrix[] {
  const [v, [v1, v2]] = mainNormals[axis];
  const offset = addMatrices(...cubeOffsetAxes.map(axis => mainNormals[axis][0]));
  return [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(coords =>
    addMatrices(
      math.multiply(v, 1 / 3),
      math.multiply(v1, coords[0] / 3),
      math.multiply(v2, coords[1] / 3),
      math.multiply(offset, 2 / 3),
    )
  );
}
