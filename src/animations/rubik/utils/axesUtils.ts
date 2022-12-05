import * as math from "mathjs";

// general utils
export function oppositeAxis(axis: number): number {
  return axis < 3 ? axis + 3 : axis - 3;
}

export function positivizeAxis(axis: number): number {
  return axis < 3 ? axis : axis - 3;
}

export function axisIsPositive(axis: number): boolean {
  return axis < 3;
}

// rotation constants
export const rotationsCycle = [
  [1, 2, 4, 5],
  [2, 0, 5, 3],
  [0, 1, 3, 4],
  [1, 5, 4, 2],
  [0, 2, 3, 5],
  [1, 0, 4, 3],
];

// export const rotationMatrices: math.Matrix[] = Array.from({length: 6}).map((_, i) => {
//   const iPos = positivizeAxis(i);
//   // const iSign = i < 3 ? 1 : -1;
//   const [axis2, axis3] = rotationsCycle[i.slice(0, 2);
//   const axis2Pos = positivizeAxis(axis2);
//   const axis3Pos = positivizeAxis(axis3);
//   const axis2Sign = axis2 < 3 ? 1 : -1;
//   const axis3Sign = axis3 < 3 ? 1 : -1;
//   const sign = axis2Sign * axis3Sign;
//   const m = math.matrix(math.zeros(3, 3));
//   m.set([iPos, iPos], 1);
//   m.set([axis2Pos, axis3Pos], sign);
//   m.set([axis3Pos, axis2Pos], -sign);
//   console.log("m", m.toString());
//   // console.log(m.size());
//   return m;
// });

const rotations = new Map<string, number>();
const rotationsGetAxes = (axis01: [number, number]) => rotations.get(axis01.join(','));
const rotationsSetAxes = (axis01: [number, number], val: number) => rotations.set(axis01.join(','), val);
for (let rotAxis = 0; rotAxis < 6; rotAxis++) {
  const cycle = rotationsCycle[rotAxis];
  let v = cycle.at(-1)!;
  for (let vNext of cycle) {
    rotationsSetAxes([rotAxis, v], vNext);
    v = vNext;
  }
  rotationsSetAxes([rotAxis, rotAxis], rotAxis);
  rotationsSetAxes([rotAxis, oppositeAxis(rotAxis)], oppositeAxis(rotAxis));
}

export function rotate(rotAxis: number, axis: number): number {
  return rotationsGetAxes([rotAxis, axis])!;
}

export function rotateAll(rotAxis: number, axes: number[]) {
  for (let i = 0; i < axes.length; i++) {
    axes[i] = rotationsGetAxes([rotAxis, axes[i]])!;
  }
}

export const facesColor = ["red", "blue", "white", "orange", "green", "yellow"];
