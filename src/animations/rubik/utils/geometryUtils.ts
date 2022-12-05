import { positions } from "@mui/system";
import * as math from "mathjs";
import { rotationsCycle } from "./axesUtils";
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

// const facetPointsFromPosition = new Map<string, [Readonly<math.Matrix>, Readonly<math.Matrix>[]]>();

// for (let axis = 0; axis < 6; axis++) {
//   const axisVec = mainNormals[axis][0];
//   let positions = [];
//   positions.push([axis]);

//   // edges
//   for (let j = 0; j < 4; j++) {
//     const axis2 = rotationsCycle[axis][j];
//     positions.push([axis, axis2]);
//   }
//   // corners
//   for (let j = 0; j < 2; j++) {
//     for (let k = 0; k < 2; k++) {
//       const axis2 = rotationsCycle[axis][j * 2];
//       const axis3 = rotationsCycle[axis][1 + k * 2];
//       positions.push([axis, axis2, axis3]);
//     }
//   }

//   for (let position of positions) {
//     position.sort();
//     facetPointsFromPosition.set(position.join(','), [axisVec, generateSquare(axis, position)]);
//   }
// }

// export function getFacetInitialPoints(position: number[]): [Readonly<math.Matrix>, Readonly<math.Matrix>[]] {
//   const key = [...position].sort().join(',');
//   return facetPointsFromPosition.get(key)!;
// }

