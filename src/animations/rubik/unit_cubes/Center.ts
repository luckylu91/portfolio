import { axisIsPositive, facesColor, positivizeAxis, rotationsCycle } from "../utils/axesUtils";
import { mainNormals } from "../utils/geometryConstants";
import { generateSquare } from "../utils/geometryUtils";
import { Movement } from "../utils/movements";
import { Facet } from "./Facet";
import { UnitCube } from "./UnitCube";

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

  reset(position: [number]) {
    const mainAxis = position[0];
    const perpAxis = rotationsCycle.get(mainAxis)!;
    const facetsNormal = [mainAxis, ...perpAxis].map(axis => mainNormals[axis][0]);
    const facetsPoints = [mainAxis, ...perpAxis].map(axis => generateSquare(axis, position));
    const facetColors = [facesColor[mainAxis], ...Array(4).fill("black")];
    this.facets.forEach((facet, i) => {
      facet.set(facetsPoints[i], facetsNormal[i], facetColors[i]);
    });
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
