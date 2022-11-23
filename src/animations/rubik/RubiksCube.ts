import { Center, Corner, Edge, Facet, UnitCube } from "./unit_cubes";
import { mainNormals } from "./utils/geometryConstants";
import { defaultMovement, Movement } from "./utils/movements";

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
  }
}

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
