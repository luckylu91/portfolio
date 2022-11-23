import * as math from "mathjs";
import { oppositeAxis, rotateAll } from "../utils/axesUtils";
import { mainNormals } from "../utils/geometryConstants";
import { Movement } from "../utils/movements";
import { Facet } from "./Facet";

export interface UnitCube {
  position: number[];
  isAffected(movement: Movement): boolean;
  facets: Facet[];
}

export abstract class UnitCube implements UnitCube {
  rotate(movement: Movement): void {
    if (this.isAffected(movement)) {
      const rotAxis = movement.positiveDirection ? movement.rotAxis : oppositeAxis(movement.rotAxis);
      rotateAll(rotAxis, this.position);
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
