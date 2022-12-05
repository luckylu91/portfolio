import { Center, Corner, Edge, Facet, UnitCube } from "./unit_cubes";
import { rotationsCycle } from "./utils/axesUtils";
import { mainNormals } from "./utils/geometryConstants";
import { defaultMovement, Movement } from "./utils/movements";

const faces = [0, 1, 2, 3, 4, 5];
const facePairs: [number, number][] = [
  [0, 1], [0, 2], [0, 4], [0, 5],
  [1, 2], [1, 3], [1, 5],
  [2, 3], [2, 4],
  [3, 4], [3, 5],
  [4, 5]
];
const faceTriplets: [number, number, number][] = [
  [0, 1, 2], [0, 2, 4], [0, 4, 5], [0, 5, 1],
  [3, 2, 1], [3, 1, 5], [3, 5, 4], [3, 4, 2]
];
// const faceTriplets: [number, number, number][] = [
//   [0, 1, 2], [0, 2, 4], [0, 4, 5], [0, 5, 1],
//   [3, 2, 1], [3, 1, 5], [3, 5, 4], [3, 4, 2]
// ];


export class RubiksCube {
  cubes: UnitCube[];
  cubesMap: Map<string, UnitCube>;
  centerBuffer: Center = new Center([0]);
  edgeBuffer: Edge = new Edge([0, 1]);
  cornerBuffer: Corner = new Corner([0, 1, 2]);

  constructor() {
    // this.cubes = [...faces.map(axis => new Center([axis])),
    //   ...facePairs.map(axisPair => new Edge(axisPair)),
    //   ...faceTriplets.map(axisTriplet => new Corner(axisTriplet))
    // ];

    ///
    this.cubes = [];
    this.cubesMap = new Map();
    for (let axis of faces) {
      const center = new Center([axis]);
      this.cubesMap.set(axis.toString(), center);
      this.cubes.push(center);
    }
    for (let axisPair of facePairs) {
      axisPair = [...axisPair].sort() as [number, number];
      const edge = new Edge(axisPair);
      this.cubesMap.set(axisPair.join(','), edge);
      this.cubes.push(edge);
    }
    for (let axisTriplet of faceTriplets) {
      axisTriplet = [...axisTriplet].sort() as [number, number, number];
      const corner = new Corner(axisTriplet);
      this.cubesMap.set(axisTriplet.join(','), corner);
      this.cubes.push(corner);
    }
  }

  reset() {
    // TODO
    this.cubes.slice(0, 6).forEach((cube, i) => cube.reset([faces[i]]));
    this.cubes.slice(6, 6 + 12).forEach((cube, i) => cube.reset(facePairs[i] as [number, number]));
    this.cubes.slice(6 + 12).forEach((cube, i) => cube.reset(faceTriplets[i] as [number, number, number]));
  }

  rotate(movement: Movement) {
    this.cubes.forEach(cube => cube.move(movement));
  }

  // move(movement: Movement) {
  //   console.log("MOVE");
  //   let l1: number[][];
  //   let l2: number[][];
  //   const axis1 = movement.rotAxis;
  //   if (movement.middle) {
  //     l1 = rotationsCycle[axis1].map(axis => [axis]);
  //     l2 = Array.from({length: 4})
  //       .map((_, i) => [
  //         rotationsCycle[axis1][i],
  //         rotationsCycle[axis1][(i+1) % 4]
  //       ]);
  //     const l1Cubes = l1.map(axes => this.cubesMap.get([...axes].sort().join(','))! as Center);
  //     const l2Cubes = l2.map(axes => this.cubesMap.get([...axes].sort().join(','))! as Edge);
  //     cycleArray(l1Cubes, (cube1, cube2) => cube1.setColors(cube2), this.centerBuffer);
  //     this.edgeBuffer.setPositionAndColors(l2Cubes[3]);
  //     cycleArray(l2Cubes, (cube1, cube2, i) => cube1.setColors(cube2, [l2[i], l2[(i+3)%4]]), this.edgeBuffer);
  //   }
  //   else {
  //     const rotationCycle = rotationsCycle[axis1];
  //     if (!movement.positiveDirection) {
  //       rotationCycle.reverse();
  //     }
  //     l1 = rotationCycle.map(axis2 => [axis1, axis2]);
  //     l2 = Array.from({length: 4})
  //       .map((_, i) => [
  //         axis1,
  //         rotationCycle[i],
  //         rotationCycle[(i+1) % 4]
  //       ]);
  //     const l1Cubes = l1.map(axes => this.cubesMap.get([...axes].sort().join(','))! as Edge);
  //     const l2Cubes = l2.map(axes => this.cubesMap.get([...axes].sort().join(','))! as Corner);
  //     this.edgeBuffer.setPositionAndColors(l1Cubes[3]);
  //     cycleArray(l1Cubes, (cube1, cube2, i) => cube1.setColors(cube2, [l1[i], l1[(i+3)%4]]), this.edgeBuffer);
  //     this.cornerBuffer.setPositionAndColors(l2Cubes[3]);
  //     cycleArray(l2Cubes, (cube1, cube2, i) => cube1.setColors(cube2, [l2[i], l2[(i+3)%4]]), this.cornerBuffer);
  //   }
    // console.log("l1", l1);
    // console.log("l2", l2);
    // const l1Cubes = l1.map(axes => this.cubesMap.get(axes.sort().join(','))!);
    // const l2Cubes = l2.map(axes => this.cubesMap.get(axes.sort().join(','))!);
    // cycleArray(l1Cubes, (cube1, cube2) => cube1.setColors(cube2), l1Buffer);
    // cycleArray(l2Cubes, (cube1, cube2) => cube1.setColors(cube2), l2Buffer);
  // }

  draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, scale: number, movement: Movement = defaultMovement(), angle: number = 0) {
    const rotAxisVec = mainNormals[movement.rotAxis][0];
    let priorities: [number, Facet][] = this.cubes.flatMap(cube => {
      const priorities = cube.priorities(movement);
      cube.rotate(movement, rotAxisVec, angle);
      return cube.rotatedFacets!.map((facet, j) => [priorities[j], facet]) as [number, Facet][]
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

function cycleArray<T>(array: Array<T>, assignFunc: (dest: T, src: T, i: number) => void, tmp: T) {
  for (let i = array.length - 1; i > 0; i--) {
    assignFunc(array[i], array[i - 1], i);
  }
  assignFunc(array[0], tmp, 0);
}

