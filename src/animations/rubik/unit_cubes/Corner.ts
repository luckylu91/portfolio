import { facesColor, positivizeAxis } from "../utils/axesUtils";
import { mainNormals } from "../utils/geometryConstants";
import { generateSquare } from "../utils/geometryUtils";
import { Movement } from "../utils/movements";
import { Facet } from "./Facet";
import { UnitCube } from "./UnitCube";

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

