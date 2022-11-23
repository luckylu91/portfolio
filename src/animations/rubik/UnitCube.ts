import * as math from "mathjs";
import { vx, vxNeg, vy, vyNeg, vz, vzNeg } from "./general";

//   \0/
//   1|2

// type definitions
export type Movement = {
  rotAxis: number,
  positiveDirection: boolean,
  middle: boolean,
};
function defaultMovement(): Movement {
  return {
    rotAxis: 0,
    positiveDirection: true,
    middle: true,
  }
}

type Rotation = (point: math.Matrix) => math.Matrix;
class Facet {
  // rotatedPoints: math.Matrix[];
  // rotatedNormal: math.Matrix;
  constructor(
    public points: math.Matrix[],
    public normal: math.Matrix,
    public color: string,
  ) {
    // this.rotatedPoints = clonePointArray(points);
    // this.rotatedNormal = math.clone(normal);
  }
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
  // lockPosition() {
  //   this.points = clonePointArray(this.rotatedPoints);
  //   this.normal = math.clone(this.rotatedNormal);
  // }
  // resetRotation() {
  //   this.rotatedPoints = clonePointArray(this.points);
  //   this.rotatedNormal = math.clone(this.normal);
  // }
}

// vector constants
const mainNormals: [math.Matrix, [math.Matrix, math.Matrix]][] = [
  [vx, [vyNeg, vz]],
  [vy, [vx, vz]],
  [vz, [vx, vy]],
  [vxNeg, [vy, vzNeg]],
  [vyNeg, [vxNeg, vzNeg]],
  [vzNeg, [vxNeg, vyNeg]]
];

// general utils
function oppositeAxis(axis: number): number {
  return axis < 3 ? axis + 3 : axis - 3;
}

function positivizeAxis(axis: number): number {
  return axis < 3 ? axis : axis - 3;
}

function axisIsPositive(axis: number): boolean {
  return axis < 3;
}

function addMatrices(...args: math.Matrix[]) {
  return args.reduce((prev: math.Matrix, current: math.Matrix) => math.add(prev, current));
}

function generateSquare(axis: number, cubeOffsetAxes: number[]): math.Matrix[] {
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


function clonePointArray(array: math.Matrix[]) {
  return array.map(point => math.clone(point));
}
// function clonePointDoubleArray(array: math.Matrix[][]) {
//   return array.map(row => row.map(point => math.clone(point)));
// }
// function rotatePointArray(array: math.Matrix[], rotAxis: math.Matrix, angle: number) {
//   for (let i = 0; i < array.length; i++) {
//     array[i] = math.rotate(array[i], angle, rotAxis);
//   }
// }
// function rotatePointDoubleArray(array: math.Matrix[][], rotAxis: math.Matrix, angle: number) {
//   for (let i = 0; i < array.length; i++) {
//     for (let j = 0; j < array[i].length; j++) {
//       array[i][j] = math.rotate(array[i][j], angle, rotAxis);
//     }
//   }
// }
console.log("vx", vx);
console.log("vy", vy);
console.log("vz", vz);

// rotation constants
const rotationsCycle = new Map([
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

function rotate<T extends number | Array<number>>(rotAxis: number, axes: T): T {
  if (axes instanceof Array<number>) {
    for (let i = 0; i < axes.length; i++) {
      axes[i] = rotationsGetAxes([rotAxis, axes[i]])!;
    }
    return axes as T;
  }
  else {
    return rotationsGetAxes([rotAxis, axes])! as T;
  }
}

// interface for unit cubes

export interface UnitCube {
  position: number[];
  isAffected(movement: Movement): boolean;
  facets: Facet[];
}

export abstract class UnitCube implements UnitCube {
  rotate(movement: Movement): void {
    if (this.isAffected(movement)) {
      this.position = rotate(movement.rotAxis, this.position);
      const rotAxisVec = mainNormals[movement.rotAxis][0];
      const angle = (movement.positiveDirection ? +1 : -1) * Math.PI / 2;
      this.facets.forEach(facet => facet.rotate(rotAxisVec, angle));
    }
  }

  abstract priorities(movement: Movement): number[];

  rotatedFacets(movement: Movement, rotAxisVec: math.Matrix, angle: number): Facet[] {
    if (this.isAffected(movement)) {
      return this.facets.map(facet => facet.rotated(rotAxisVec, angle));
    }
    else {
      return this.facets;
    }
  }
}

// unit cubes implementation

const facesColor = ["red", "blue", "white", "orange", "green", "yellow"];

export class Center extends UnitCube {
  constructor(public position: [number]) {
    super();
    const mainAxis = this.position[0];
    const perpAxis = rotationsCycle.get(mainAxis)!;
    const facetsNormal = [mainAxis, ...perpAxis].map(axis => mainNormals[axis][0]);
    const facetsPoints = [mainAxis, ...perpAxis].map(axis => generateSquare(axis, position));
    const facetColors = [facesColor[mainAxis], ...Array(4).fill("black")];
    this.facets = facetsPoints.map((points, i) => new Facet(points, facetsNormal[i], facetColors[i]));
  }

  isAffected(movement: Movement): boolean {
    return (
      movement.middle && rotationsCycle.get(this.position[0])!.includes(movement.rotAxis)
    ||
      !movement.middle && movement.rotAxis == this.position[0]
    );
  }
  priorities(movement: Movement): number[] {
    const mainAxis = this.position[0];
    const mainAxisPos = positivizeAxis(this.position[0]);
    const movementAxisPos = positivizeAxis(movement.rotAxis);
    let priority;
    if (mainAxisPos == movementAxisPos) {
      priority = axisIsPositive(mainAxis) ? 3 : 1;
    }
    else {
      priority = 2;
    }
    return [priority, 0, 0, 0, 0];
  }
}

export class Edge extends UnitCube {
  constructor(public position: [number, number]) {
    super();
    const axis0 = this.position[0];
    const axis1 = this.position[1];
    const axis2 = rotate(axis0, axis1);
    const axis3 = rotate(axis1, axis0);
    const facetsNormal = [axis0, axis1, axis2, axis3].map(axis => mainNormals[axis][0]);
    const facetsPoints = [axis0, axis1, axis2, axis3].map(axis => generateSquare(axis, position));
    const facetColors = [facesColor[axis0], facesColor[axis1], ...Array(2).fill("black")];
    this.facets = facetsPoints.map((points, i) => new Facet(points, facetsNormal[i], facetColors[i]));
  }

  isAffected(movement: Movement): boolean {
    const movementAxisOpp = oppositeAxis(movement.rotAxis);
    return (
      !movement.middle && this.position.includes(movement.rotAxis)
    ) || (
        movement.middle && (
          !this.position.includes(movement.rotAxis) &&
          !this.position.includes(movementAxisOpp)
        )
      );
  }

  priorities(movement: Movement): number[] {
    const movementAxisPos = positivizeAxis(movement.rotAxis);
    const movementAxisNeg = oppositeAxis(movementAxisPos);
    let priority;
    if (this.position.includes(movementAxisPos)) {
      priority = 3;
    }
    else if (this.position.includes(movementAxisNeg)) {
      priority = 1;
    }
    else {
      priority = 2;
    }
    return [priority, priority, 0, 0];
  }
}

export class Corner extends UnitCube {
  constructor(public position: [number, number, number]) {
    super();
    const axis0 = this.position[0];
    const axis1 = this.position[1];
    const axis2 = this.position[2];
    const [axis3, axis4, axis5] = [0, 1, 2, 3, 4, 5].filter(axis => !this.position.includes(axis));
    const facetsNormal = [axis0, axis1, axis2, axis3, axis4, axis5].map(axis => mainNormals[axis][0]);
    const facetsPoints = [axis0, axis1, axis2, axis3, axis4, axis5].map(axis => generateSquare(axis, position));
    const facetColors = [facesColor[axis0], facesColor[axis1], facesColor[axis2], ...Array(3).fill("black")];
    this.facets = facetsPoints.map((points, i) => new Facet(points, facetsNormal[i], facetColors[i]));
  }

  isAffected(movement: Movement): boolean {
    return !movement.middle && this.position.includes(movement.rotAxis);
  }

  priorities(movement: Movement): number[] {
    const movementAxisPos = positivizeAxis(movement.rotAxis);
    let priority;
    if (this.position.includes(movementAxisPos)) {
      priority = 3;
    }
    else {
      priority = 1;
    }
    return [priority, priority, priority, 0, 0, 0];
  }
}


// Whole RibiksCube class

const faces = [0, 1, 2, 3, 4, 5];
const facePairs = [
  [0, 1], [0, 2], [0, 4], [0, 5],
  [1, 2], [1, 3], [1, 5],
  [2, 3], [2, 4],
  [3, 4], [3, 5],
  [4, 5]
];
const faceTriplets = [
  [0, 1, 2], [0, 2, 4], [0, 4, 5], [0, 5, 1],
  [3, 2, 1], [3, 1, 5], [3, 5, 4], [3, 4, 2]
];

export class RubiksCube {
  cubes: UnitCube[];
  constructor() {
    this.cubes = [
      ...faces.map(axis => new Center([axis])),
      ...facePairs.map(axisPair => new Edge(axisPair as [number, number])),
      ...faceTriplets.map(axisTriplet => new Corner(axisTriplet as [number, number, number]))
    ];
  }

  rotate(movement: Movement) {
    this.cubes.forEach(cube => cube.rotate(movement));
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, scale: number, movement: Movement = defaultMovement(), angle: number = 0) {
    const rotAxisVec = mainNormals[movement.rotAxis][0];
    // this.cubes.forEach(cube => cube.rotateFacets(movement, rotAxisVec, angle));
    let priorities: [number, Facet][] = this.cubes.flatMap(cube => {
      const priorities = cube.priorities(movement);
      return cube.rotatedFacets(movement, rotAxisVec, angle).map((facet, j) => [priorities[j], facet]) as [number, Facet][]
    });
    const facetOrdered = priorities.sort(([priority1, f1], [priority2, f2]) => priority1 - priority2).map(([_, facet]) => facet);
    for (let facet of facetOrdered) {
      if (facet.normal.get([2]) < 0)
        continue;
      drawOnePolygon(ctx, facet.points, facet.color, scale, offsetX, offsetY);
    }
    // this.cubes.forEach(cube => cube.resetRotation());
  }
}


/*
DEBUG
*/
// function drawOnePolygon(ctx: CanvasRenderingContext2D, polygon: math.Matrix[], color: string, scale: number, offsetX: number, offsetY: number, priority: number) {
//   ctx.fillStyle = color;
//   ctx.beginPath();
//   for (let j = 0; j < polygon.length; j++) {
//     let vertex = polygon[j];
//     const x = vertex.get([0]) * scale + offsetX;
//     const y = vertex.get([1]) * scale + offsetY;
//     if (j == 0)
//       ctx.moveTo(x, y);
//     else
//       ctx.lineTo(x, y);
//   }
//   ctx.closePath();
//   ctx.fill();
//   //
//   const mean = math.multiply(addMatrices(...polygon), 1 / 4);
//   const x = mean.get([0]) * scale + offsetX;
//   const y = mean.get([1]) * scale + offsetY;
//   ctx.font = "18px Arial";
//   ctx.fillStyle = "black";
//   ctx.fillText(priority.toString(), x, y);
// }

// graphic primitive
function drawOnePolygon(ctx: CanvasRenderingContext2D, polygon: math.Matrix[], color: string, scale: number, offsetX: number, offsetY: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let j = 0; j < polygon.length; j++) {
    let vertex = polygon[j];
    const x = vertex.get([0]) * scale + offsetX;
    const y = vertex.get([1]) * scale + offsetY;
    if (j == 0)
      ctx.moveTo(x, y);
    else
      ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

// Parse notation into Movement data structure
const movementNotations = new Map([
  ["R", 0],
  ["F", 1],
  ["U", 2],
  ["L", 3],
  ["B", 4],
  ["D", 5],
]);
const movementSliceNotations = new Map([
  ["S", 0],
  ["M", 1],
  ["E", 2],
]);
export function movementFromNotation(notation: string) {
  let rotAxis, positiveDirection = true, middle = false;
  const letter = notation[0];

  if (movementNotations.has(letter)) {
    rotAxis = movementNotations.get(letter)!;
  }
  else {
    middle = true;
    rotAxis = movementSliceNotations.get(letter)!;
  }
  if (notation.length >= 2) {
    positiveDirection = false;
  }

  return {
    rotAxis,
    middle,
    positiveDirection
  };
}

const movementRegex = /^[RFULBDSME]'?/;
export function parseMovementString(s: string): Movement[] | null {
  const movements = [];
  while (s.length > 0) {
    const match = s.match(movementRegex);
    if (match === null)
      return null;
    movements.push(movementFromNotation(match[0]));
    s = s.slice(match.length);
  }
  return movements;
}
