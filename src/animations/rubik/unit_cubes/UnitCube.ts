import * as math from "mathjs";
import { oppositeAxis, rotateAll } from "../utils/axesUtils";
import { mainNormals } from "../utils/geometryConstants";
import { Movement } from "../utils/movements";
import { Facet } from "./Facet";

export interface UnitCube {
  position: number[];
  isAffected(movement: Movement): boolean;
  facets: Facet[];
  rotatedFacets?: Facet[];
  reset(position: number[]): void;
}

export abstract class UnitCube implements UnitCube {
  abstract priorities(movement: Movement): number[];

  move(movement: Movement): void {
    if (this.isAffected(movement)) {
      const rotAxis = movement.positiveDirection ? movement.rotAxis : oppositeAxis(movement.rotAxis);
      rotateAll(rotAxis, this.position);
      const rotAxisVec = mainNormals[movement.rotAxis][0];
      const angle = (movement.positiveDirection ? +1 : -1) * Math.PI / 2;
      this.facets.forEach(facet => facet.rotate(rotAxisVec, angle));
    //   */
    //  const [normal, points] = getFacetInitialPoints(this.position);
    //  this.facets.forEach(facet => facet.set(points, normal, facet.color));
    }
  }

  rotate(movement: Movement, rotAxisVec: math.Matrix, angle: number) {
    if (this.rotatedFacets === undefined) {
      this.rotatedFacets = this.facets.map(facet => facet.clone())
    }
    if (this.isAffected(movement)) {
      this.facets.forEach((facet, i) => {
        const rFacet = this.rotatedFacets![i];
        facet.rotateInto(rFacet, rotAxisVec, angle);
      })
    }
    else {
      this.facets!.forEach((facet, i) => facet.copyInto(this.rotatedFacets![i]));
    }
  }

  // abstract setColors(other: UnitCube): void;
}
