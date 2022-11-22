import * as math from "mathjs";
import { hasUncaughtExceptionCaptureCallback } from "process";
import { TypeOfExpression } from "typescript";
import { vx, vxNeg, vxyz, vxyzNeg, vy, vyNeg, vz, vzNeg } from "./general";

type Rotation = {
  axis: math.Matrix,
  otherAxis: [math.Matrix, math.Matrix],
  angle: number,
};
enum IntersticeState {
  INVISIBLE,
  STATIC,
  MOVING
};
type Movement = {
  axisIndex: number,
  direction: number,
  rowIndex: number,
  intersticeStates: [IntersticeState, IntersticeState];
};
type FacetFilter = (iFace: number, x: number, y: number) => boolean;
const mainNormals: [math.Matrix, [math.Matrix, math.Matrix]][] = [
  [vx, [vyNeg, vz]],
  [vy, [vx, vz]],
  [vz, [vx, vy]],
  [vxNeg, [vy, vzNeg]],
  [vyNeg, [vxNeg, vzNeg]],
  [vzNeg, [vxNeg, vyNeg]]
];
const initialFacetColors = generateFacetColors();
const initialFacetVertices = generateFacetPositions();
const initialFacetNormals = generateFacetNormals();
const initialInterstices = generateInterstices();

function axisFromIndex(axisIndex: number): math.Matrix {
  return mainNormals[axisIndex][0];
}

function otherAxisFromIndex(axisIndex: number): [math.Matrix, math.Matrix] {
  return mainNormals[axisIndex][1];
}

function indexFromAxis(axis: math.Matrix): number {
  const [x, y, z] = [vx, vy, vz].map(v => Math.round(math.dot(axis, v)));
  if (x != 0 && y == 0 && z == 0) {
    return (x > 0) ? 0 : 3;
  }
  else if (x == 0 && y != 0 && z == 0) {
    return (y > 0) ? 1 : 4;
  }
  else if (x == 0 && y == 0 && z != 0) {
    return (z > 0) ? 2 : 5;
  }
  else {
    throw Error(`Invalid axis in indexFromAxis: [${x}, ${y}, ${z}]`);
  }
}

function oppositeAxisIndex(axisIndex: number) {
  return axisIndex < 3 ? axisIndex + 3 : axisIndex - 3;
}

function positiveAxisIndex(axisIndex: number) {
  return axisIndex < 3 ? axisIndex : axisIndex - 3;
}

export class RubikState {
  facetColors: string[][][];
  facetVertices: math.Matrix[][][][]; // face, row, col, points
  facetNormals: math.Matrix[][][];
  interstices: math.Matrix[][][];
  // currentRotation?: Rotation;
  currentMovement?: Movement;
  currentMovementFilters?: (rowIndex: number) => FacetFilter;

  constructor() {
    this.facetColors = deepClone(initialFacetColors);
    this.facetVertices = deepClone(initialFacetVertices);
    this.facetNormals = deepClone(initialFacetNormals);
    this.interstices = deepClone(initialInterstices);
    // this.facetColors = generateFacetColors();
    // this.facetVertices = generateFacetPositions();
    // this.facetNormals = generateFacetNormals();

  }

  // rotateMid(coef: number) {
  //   this.currentRotation = {
  //     axis: axisFromIndex(2),
  //     otherAxis: otherAxisFromIndex(2),
  //     angle: coef * Math.PI / 2
  //   };
  //   for (let iFace of [0, 1, 3, 4]) {
  //     for (let x = 0; x < 3; x++) {
  //       for (let i = 0; i < 4; i++) {
  //         this.facetVertices[iFace][x][1][i] = math.rotate(initialFacetVertices[iFace][x][1][i], this.currentRotation!.angle, this.currentRotation!.axis);
  //       }
  //       this.facetNormals[iFace][x][1] = math.rotate(initialFacetNormals[iFace][x][1], this.currentRotation!.angle, this.currentRotation!.axis);
  //     }
  //   }
  // }

  setMovement(movement: Movement) {
    this.currentMovement = movement;
    this.currentMovementFilters = facetFiltersFromMovementAxis(movement.axisIndex);
  }

  move(coef: number) {
    if (this.currentMovement === undefined) {
      // error
      return;
    }
    const axis = axisFromIndex(this.currentMovement.axisIndex);
    const angle = this.currentMovement.direction * coef * Math.PI / 2;
    for (let iFace = 0; iFace < 6; iFace++) {
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          if (this.currentMovementFilters!(this.currentMovement.rowIndex)(iFace, x, y)) {
            for (let i = 0; i < 4; i++) {
              this.facetVertices[iFace][x][y][i] = math.rotate(initialFacetVertices[iFace][x][y][i], angle, axis);
            }
            this.facetNormals[iFace][x][y] = math.rotate(initialFacetNormals[iFace][x][y], angle, axis);
          }
        }
      }
    }
    for (let iInterstice = 0; iInterstice < 2; iInterstice++) {
      if (this.currentMovement.intersticeStates[iInterstice] == IntersticeState.MOVING) {
        for (let i = 0; i < 4; i++) {
          this.interstices[this.currentMovement.axisIndex][iInterstice][i] = math.rotate(initialInterstices[this.currentMovement.axisIndex][iInterstice][i], angle, axis);
        }
      }
    }
  }

  completeMovement() {
    if (this.currentMovement === undefined) {
      // error
    }
    // move back facets 3d positions
    this.facetNormals = deepClone(initialFacetNormals);
    this.facetVertices = deepClone(initialFacetVertices);
    this.interstices = deepClone(initialInterstices);
    permutateStateAsResultFromMovement(this.currentMovement!, this.facetColors);
    // permute facets colors according to mmovement
    this.currentMovement = undefined;
  }

  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, scale: number) {
    if (this.currentMovement === undefined) {
      this.drawFiltered(ctx, offsetX, offsetY, scale);
      return;
    }
    this.drawFiltered(ctx, offsetX, offsetY, scale, this.currentMovementFilters!(2));
    if (this.currentMovement!.intersticeStates[0] != IntersticeState.INVISIBLE) {
      drawOnePolygon(ctx, this.interstices[this.currentMovement!.axisIndex][0], "black", scale, offsetX, offsetY);
    }
    this.drawFiltered(ctx, offsetX, offsetY, scale, this.currentMovementFilters!(1));
    if (this.currentMovement!.intersticeStates[1] != IntersticeState.INVISIBLE) {
      drawOnePolygon(ctx, this.interstices[this.currentMovement!.axisIndex][1], "black", scale, offsetX, offsetY);
    }
    this.drawFiltered(ctx, offsetX, offsetY, scale, this.currentMovementFilters!(0));
  }

  drawFiltered(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, scale: number, filter?: FacetFilter) {
    for (let iFace = 0; iFace < 6; iFace++) {
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          if (filter && !filter(iFace, x, y))
            continue;
          if (this.facetNormals[iFace][x][y].get([2]) < 0)
            continue;
          drawOnePolygon(ctx, this.facetVertices[iFace][x][y], this.facetColors[iFace][x][y], scale, offsetX, offsetY);
        }
      }
    }
  }
}

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

function generateFacetPositions(): math.Matrix[][][][] {
  return mainNormals.map(vBase => {
    let faceNormale = vBase[0];
    let [faceUx, faceUy] = vBase[1];
    return [-1, -1 / 3, 1 / 3].map(x => {
      return [-1, -1 / 3, 1 / 3].map(y => {
        return [[0, 0], [0, 1], [1, 1], [1, 0]].map(dxdy => {
          const dx = dxdy[0];
          const dy = dxdy[1];
          let p = math.add(
            math.multiply(faceUx, x + dx * 2 / 3),
            math.multiply(faceUy, y + dy * 2 / 3),
          );
          p = math.add(
            p,
            faceNormale,
          );
          return p;
        });
      })
    });
  });
}

// size: [6, 3, 3]: [Face, Face row, Face col]
function generateFacetColors(): string[][][] {
  return ["red", "blue", "white", "orange", "green", "yellow"].map(c =>
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => c))
  );
}

// size: [6, 3, 3]: [Face, Face row, Face col]
function generateFacetNormals(): math.Matrix[][][] {
  return mainNormals.map(normaleXothers =>
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => normaleXothers[0]))
  );
}

// size [3, 2, 4]: [Face, Direction (+1/3 or -1/3 offset along axis), Points]
function generateInterstices(): math.Matrix[][][] {
  return mainNormals.slice(0, 3).map(normaleXothers =>
    [-1 / 3, 1 / 3].map(ordinate =>
      [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(aXb => {
        let v = math.multiply(normaleXothers[0], ordinate);
        const v1 = math.multiply(normaleXothers[1][0], aXb[0]);
        const v2 = math.multiply(normaleXothers[1][1], aXb[1]);
        v = math.add(v, v1);
        v = math.add(v, v2);
        return v;
      })
    )
  );
}

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

export function rotationFromNotation(rotationStr: string): Movement {
  let axisIndex, direction = 1, rowIndex = 0;
  const letter = rotationStr[0];

  if (movementNotations.has(letter)) {
    axisIndex = movementNotations.get(letter)!;
    if (axisIndex >= 3) {
      axisIndex -= 3;
      direction = -1;
      rowIndex = 2;
    }
  }
  else {
    axisIndex = movementSliceNotations.get(letter)!;
    rowIndex = 1;
  }
  if (rotationStr.length >= 2) {
    direction *= -1;
  }
  let intersticeStates: [IntersticeState, IntersticeState] | undefined = undefined;
  switch (rowIndex) {
    case 0:
      intersticeStates = [IntersticeState.INVISIBLE, IntersticeState.STATIC];
      break;
    case 1:
      intersticeStates = [IntersticeState.STATIC, IntersticeState.MOVING];
      break;
    case 2:
      intersticeStates = [IntersticeState.MOVING, IntersticeState.INVISIBLE];
      break;
  }

  return {
    axisIndex,
    direction,
    rowIndex,
    intersticeStates: intersticeStates!
  };
}

function deepClone<T>(multiArray: T): T {
  if (multiArray instanceof Array) {
    return Array.from(multiArray.map(t => deepClone(t))) as unknown as T;
  }
  return multiArray;
}

function* genLateralFaceAndLocalMovementDirectionIndices(axisIndex: number): Generator<[number, [number, number]]> {
  const rotAxis = axisFromIndex(axisIndex);
  let [normale, _] = otherAxisFromIndex(axisIndex);
  for (let i = 0; i < 4; i++) {
    let faceUx = math.matrix(math.cross(rotAxis, normale));
    const [_x, _y, _z] = [0, 1, 2].map(i => faceUx.get([i]));
    console.log(`[${_x}, ${_y}, ${_z}]`);
    let faceIndex = indexFromAxis(normale);
    let faceOtherAxis = otherAxisFromIndex(faceIndex);
    let val1 = Math.round(math.dot(faceUx, faceOtherAxis[0]));
    let val2 = Math.round(math.dot(faceUx, faceOtherAxis[1]));

    if (val1 != 0) {
      let rowDirectionSign = math.dot(faceOtherAxis[1], rotAxis);
      yield [faceIndex, [0, rowDirectionSign]];
    }
    else {
      let rowDirectionSign = math.dot(faceOtherAxis[0], rotAxis);
      yield [faceIndex, [1, rowDirectionSign]];
    }
    normale = math.matrix(faceUx);
  }
}

function permutateStateAsResultFromMovement<TState>(movement: Movement, state: TState[][][]) {
  // lateral facets
  // generating position array
  const rotAxisIndex = movement.direction > 0 ? movement.axisIndex : oppositeAxisIndex(movement.axisIndex);
  const laterals = Array.from(genLateralFaceAndLocalMovementDirectionIndices(rotAxisIndex));
  let lateralPositions = [];
  for (let [faceIndex, [colAxisIndex, rowDirectionSign]] of laterals) {
    let dx = 1;
    let dy = 0;
    let x0 = 0;
    let y0 = rowDirectionSign > 0 ? 2 - movement.rowIndex : movement.rowIndex;
    if (colAxisIndex == 1) {
      [dx, dy] = [dy, dx];
      [x0, y0] = [y0, x0];
    }
    lateralPositions.push([0, 1, 2].map(offset => [faceIndex, x0 + offset * dx, y0 + offset * dy]));
  }
  // applying permutation
  for (let i = 0; i < 3; i++) {
    let [iFace, x, y] = lateralPositions[0][i];
    const tmp = state[iFace][x][y];
    for (let j = 1; j < 4; j++) {
      let [iFace2, x2, y2] = lateralPositions[j][i];
      state[iFace][x][y] = state[iFace2][x2][y2];
      [iFace, x, y] = [iFace2, x2, y2];
    }
    state[iFace][x][y] = tmp;
  }

  if (movement.rowIndex == 0 || movement.rowIndex == 2) {
    // face facets
    // generating position array
    let rotQuarter, dx, dy;
    const rotAxis = axisFromIndex(rotAxisIndex);
    let [v1, v2] = otherAxisFromIndex(rotAxisIndex);
    if (math.dot(math.cross(rotAxis, v1), v2) > 0) {
      rotQuarter = (x: number, y: number) => [-y, x];
      [dx, dy] = [1, 0];
    }
    else {
      rotQuarter = (x: number, y: number) => [y, -x];
      [dx, dy] = [0, 1];
    }
    let [x, y] = [0, 0];
    let facePositions = [];
    for (let q = 0; q < 4; q++) {
      for (let i = 0; i < 2; i++) {
        facePositions.push([x, y]);
        x += dx;
        y += dy;
      }
      [dx, dy] = rotQuarter(dx, dy);
    }
    // applying permutation
    const iFace = rotAxisIndex;
    for (let i = 0; i < 2; i++) {
      let [x, y] = facePositions[i];
      const tmp = state[iFace][x][y];
      for (let j = 1; j < 4; j++) {
        let [x2, y2] = facePositions[i + 2 * j];
        state[iFace][x][y] = state[iFace][x2][y2];
        [x, y] = [x2, y2];
      }
      state[iFace][x][y] = tmp;
    }
  }
}

function facetFiltersFromMovementAxis(axisIndex: number): (rowIndex: number) => FacetFilter {
  const laterals = new Map(genLateralFaceAndLocalMovementDirectionIndices(axisIndex));
  const frontFaceIndex = axisIndex;
  const backFaceIndex = oppositeAxisIndex(frontFaceIndex);

  return (rowIndex: number) => {
    switch (rowIndex) {
      case 0:
        return (faceIndex, x, y) => {
          if (faceIndex == frontFaceIndex)
            return true;
          if (laterals.has(faceIndex)) {
            const [colAxisIndex, rowDirectionSign] = laterals.get(faceIndex)!;
            const val = colAxisIndex == 0 ? y : x;
            return rowDirectionSign > 0 ? val == 2 : val == 0;
          }
          return false;
        }
      case 1:
        return (faceIndex, x, y) => {
          if (laterals.has(faceIndex)) {
            const [colAxisIndex, _] = laterals.get(faceIndex)!;
            const val = colAxisIndex == 0 ? y : x;
            return val == 1;
          }
          return false;
        }
      default:
        return (faceIndex, x, y) => {
          if (faceIndex == backFaceIndex)
            return true;
          if (laterals.has(faceIndex)) {
            const [colAxisIndex, rowDirectionSign] = laterals.get(faceIndex)!;
            const val = colAxisIndex == 0 ? y : x;
            return rowDirectionSign > 0 ? val == 0 : val == 2;
          }
          return false;
        }
    }
  }


}
