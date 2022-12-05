import { facesColor, oppositeAxis, positivizeAxis, rotate } from "../utils/axesUtils";
import { mainNormals } from "../utils/geometryConstants";
import { generateSquare } from "../utils/geometryUtils";
import { Movement } from "../utils/movements";
import { Facet } from "./Facet";
import { UnitCube } from "./UnitCube";

export class Edge extends UnitCube {
  constructor(public position: [number, number]) {
    super();
    const [facetsNormal, facetsPoints, facetColors] = this.computeFacets(position);
    this.facets = facetsPoints.map((points, i) => new Facet(points, facetsNormal[i], facetColors[i]));
  }

  reset(position: [number, number]) {
    this.position = position;
    const [facetsNormal, facetsPoints, facetColors] = this.computeFacets(position);
    this.facets.forEach((facet, i) => facet.set(facetsPoints[i], facetsNormal[i], facetColors[i]));
  }

  private computeFacets(position: [number, number]) {
    const axis0 = position[0];
    const axis1 = position[1];
    const axis2 = rotate(axis0, axis1);
    const axis3 = rotate(axis1, axis0);
    const facetsNormal = [axis0, axis1, axis2, axis3].map(axis => mainNormals[axis][0]);
    const facetsPoints = [axis0, axis1, axis2, axis3].map(axis => generateSquare(axis, position));
    const facetColors = [facesColor[axis0], facesColor[axis1], ...Array(2).fill("black")];
    return [facetsNormal, facetsPoints, facetColors];
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


  setColors(other: Edge, matching: number[][]) {
    console.log("SET_COLORS");
    console.log("Edge");
    console.log("this.position", this.position);
    console.log("other.position", other.position);
    console.log("matching[0]", matching[0]);
    console.log("matching[1]", matching[1]);

    for (let i = 0; i < 2; i++) {
      const i1 = this.position.indexOf(matching[0][i]);
      const i2 = other.position.indexOf(matching[1][i]);
      console.log("i1", i1);
      console.log("i2", i2);
      this.facets[i1].color = other.facets[i2].color;
    }
  }


  setPositionAndColors(other: Edge) {
    this.position = [...other.position];
    for (let i = 0; i < 2; i++) {
      this.facets[i].color = other.facets[i].color;
    }
  }
}
