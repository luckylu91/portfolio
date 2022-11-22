import math from "mathjs";
import { vx, vxNeg, vy, vyNeg, vz, vzNeg } from "./general";

//   \0/
//   1|2

// type definitions
type Movement = {
  rotAxis: number,
  positiveDirection: boolean,
  middle: boolean,
};
type Rotation = (point: math.Matrix) => math.Matrix;

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

function generateSquare(axis: number): math.Matrix[] {
  const [v, [v1, v2]] = mainNormals[axis];
  return [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(coords =>
    addMatrices(
      math.multiply(v, 1 / 3),
      math.multiply(v1, coords[0] / 3),
      math.multiply(v2, coords[1] / 3),
    )
  );
}

function cloneFacets(facets: math.Matrix[][]) {
  return facets.map(facet => facet.map(point => math.clone(point)));
}

function rotateFacets(facets: math.Matrix[][], rotation: Rotation) {
  for (let i = 0; i < facets.length; i++) {
    for (let j = 0; j < 4; j++) {
      facets[i][j] = rotation(facets[i][j]);
    }
  }
}

// rotation constants
const rotationsCycle = new Map([
  [0, [1, 2, 4, 5]],
  [1, [2, 0, 5, 3]],
  [2, [0, 1, 3, 4]],
  [3, [1, 5, 4, 2]],
  [4, [0, 2, 3, 5]],
  [5, [1, 0, 4, 3]],
]);

const rotations = new Map<[number, number], number>();
for (let rotAxis = 0; rotAxis < 6; rotAxis++) {
  const cycle = rotationsCycle.get(rotAxis)!;
  let v = cycle[-1];
  for (let vNext of cycle) {
    rotations.set([rotAxis, v], vNext);
    v = vNext;
  }
  rotations.set([rotAxis, rotAxis], rotAxis);
  rotations.set([rotAxis, oppositeAxis(rotAxis)], oppositeAxis(rotAxis));
}

function rotate<T extends number | Array<number>>(rotAxis: number, axis: T): T {
  if (axis instanceof Array<number>) {
    for (let i = 0; i < axis.length; i++) {
      axis[i] = rotations.get([rotAxis, axis[i]])!;
    }
    return axis as T;
  }
  else {
    return rotations.get([rotAxis, axis])! as T;
  }
}

// interface for unit cubes

export interface UnitCube {
  position: number[];
  isAffected(movement: Movement): boolean;
  facets: math.Matrix[][];
  facetColors: string[];
}

export abstract class UnitCube implements UnitCube {
  rotate(rotAxis: number): void {
    rotate(rotAxis, this.position);
  }

  abstract priority(movement: Movement): number;
  rotatedFacets(movement: Movement, rotation: Rotation): [math.Matrix[], string][] {
    let facets = cloneFacets(this.facets);
    if (this.isAffected(movement)) {
      rotateFacets(facets, rotation);
    }
    return facets.map((facet, i) => [facet, this.facetColors[i]]);
  }
}

// unit cubes implementation

export class Center extends UnitCube {
  private facets;
  private facetColors;
  constructor(private color: string, public position: [number]) {
    super();
    const mainAxis = this.position[0];
    const perpAxis = rotationsCycle.get(mainAxis)!;
    this.facets = [mainAxis, ...perpAxis].map(axis => generateSquare(axis)); // +OFFSET ?
    this.facetColors = [color, ...Array(4).fill("black")];
  }

  private isAffected(movement: Movement): boolean {
    return movement.middle && rotationsCycle.get(this.position[0])!.includes(movement.rotAxis);
  }
  private priority(movement: Movement): number {
    const mainAxis = this.position[0];
    const mainAxisPos = positivizeAxis(this.position[0]);
    const movementAxisPos = positivizeAxis(movement.rotAxis);
    if (mainAxisPos == movementAxisPos) {
      return axisIsPositive(mainAxis) ? 1 : -1;
    }
    else {
      return 0;
    }
  }
}

export class Edge extends UnitCube {
  constructor(public colors: [string, string], public position: [number, number]) {
    super();
    const axis0 = this.position[0];
    const axis1 = this.position[1];
    const axis2 = rotate(axis0, axis1);
    const axis3 = rotate(axis1, axis0);
    this.facets = [axis0, axis1, axis2, axis3].map(axis => generateSquare(axis));
    this.facetColors = [colors[0], colors[1], "black", "black"];
  }

  private isAffected(movement: Movement): boolean {
    return (
      !movement.middle && this.position.includes(movement.rotAxis)
    ) || (
      movement.middle && !this.position.includes(movement.rotAxis)
    );
  }

  private priority(movement: Movement) {
    const movementAxisPos = positivizeAxis(movement.rotAxis);

    if movement
  }
}

export class Corner extends UnitCube {
  constructor(public colors: [string, string, string], public position: [number, number, number]) {
    super();
    const axis0 = this.position[0];
    const axis1 = this.position[1];
    const axis2 = this.position[2];
    const [axis3, axis4, axis5] = [0, 1, 2, 3, 4, 5].filter(axis => !this.position.includes(axis));
    this.facets = [axis0, axis1, axis2, axis3, axis4, axis5].map(axis => generateSquare(axis));
    this.facetColors = [colors[0], colors[1], colors[2], "black", "black", "black"];
  }
  private isAffected(movement: Movement): boolean {
    return !movement.middle && this.position.includes(movement.rotAxis);
  }

  private priority(movement: Movement) {
    const movementAxisPos = positivizeAxis(movement.rotAxis);

  }
}
