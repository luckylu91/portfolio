import { facesColor, positivizeAxis } from "../utils/axesUtils";
import { mainNormals } from "../utils/geometryConstants";
import { generateSquare } from "../utils/geometryUtils";
import { Movement } from "../utils/movements";
import { Facet } from "./Facet";
import { UnitCube } from "./UnitCube";

export class Corner extends UnitCube {
  constructor(public position: [number, number, number]) {
    super();
    const [facetsNormal, facetsPoints, facetColors] = this.computeFacets(position);
    this.facets = facetsPoints.map((points, i) => new Facet(points, facetsNormal[i], facetColors[i]));
  }

  reset(position: [number, number, number]) {
    this.position = position;
    const [facetsNormal, facetsPoints, facetColors] = this.computeFacets(position);
    this.facets.forEach((facet, i) => facet.set(facetsPoints[i], facetsNormal[i], facetColors[i]));
  }

  private computeFacets(position: [number, number, number]) {
    const axis0 = position[0];
    const axis1 = position[1];
    const axis2 = position[2];
    const [axis3, axis4, axis5] = [0, 1, 2, 3, 4, 5].filter(axis => !position.includes(axis));
    const facetsNormal = [axis0, axis1, axis2, axis3, axis4, axis5].map(axis => mainNormals[axis][0]);
    const facetsPoints = [axis0, axis1, axis2, axis3, axis4, axis5].map(axis => generateSquare(axis, position));
    const facetColors = [facesColor[axis0], facesColor[axis1], facesColor[axis2], ...Array(3).fill("black")];
    return [facetsNormal, facetsPoints, facetColors];
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

