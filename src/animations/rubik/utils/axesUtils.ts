import * as math from "mathjs";
import { mainNormals } from "./geometryConstants";

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
export const rotationsCycle = new Map([
  [0, [1, 2, 4, 5]],
  [1, [2, 0, 5, 3]],
  [2, [0, 1, 3, 4]],
  [3, [1, 5, 4, 2]],
  [4, [0, 2, 3, 5]],
  [5, [1, 0, 4, 3]],
]);

const rotations = new Map<string, number>();
const rotationsGetAxes = (axis01: [number, number]) => rotations.get(axis01.join(','));
const rotationsSetAxes = (axis01: [number, number], val: number) => rotations.set(axis01.join(','), val);
for (let rotAxis = 0; rotAxis < 6; rotAxis++) {
  const cycle = rotationsCycle.get(rotAxis)!;
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
