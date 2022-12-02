import { Movement, reversedMovement } from "./rubik/utils/movements";
import { RubiksCube } from "./rubik/RubiksCube";
import { DrawSurface } from "./DrawSurface";

export class RubiksCubeManager {
  rubiksCube: RubiksCube = new RubiksCube();
  currentMovementIndex: number = 0;
  currentMovementCompletion: number = 0;
  movements: Movement[] | null = null;

  initialize(movements: Movement[] | null) {
    this.rubiksCube.reset();
    this.currentMovementIndex = 0;
    this.movements = movements;
    if (this.movements !== null) {
      this.movements.slice().reverse().forEach(movement => this.rubiksCube!.rotate(reversedMovement(movement)));
      // this.update();
    }
  }

  update(alpha: number) {
    if (this.movements === null)
      return;
    const sliderValue = alpha * this.movements.length;
    const newMovementIndex = alpha < 1 ? Math.floor(sliderValue) : this.movements.length - 1;
    this.moveTo(newMovementIndex);
    this.currentMovementCompletion = alpha < 1 ? sliderValue - Math.floor(sliderValue) : 1;
  }

  private moveTo(newMovementIndex: number) {
    let movements: Movement[] = [];
    if (newMovementIndex > this.currentMovementIndex) {
      movements = this.movements!
        .slice(this.currentMovementIndex, newMovementIndex)
        .map(movement => { return {...movement}; });
    }
    else if (newMovementIndex < this.currentMovementIndex) {
      movements = this.movements!
        .slice(newMovementIndex, this.currentMovementIndex)
        .reverse()
        .map(movement => reversedMovement(movement));
    }
    for (let movement of movements) {
      this.rubiksCube!.rotate(movement);
    }
    this.currentMovementIndex = newMovementIndex;
  }

  draw(surface: DrawSurface) {
    surface.clear();
    if (this.movements === null || this.movements.length == 0) {
      this.rubiksCube!.draw(surface.ctx, surface.offset[0], surface.offset[1], surface.scale);
    }
    else {
      const movement = this.movements[this.currentMovementIndex];
      const angle = (movement.positiveDirection ? +1 : -1) * Math.PI / 2 * this.currentMovementCompletion;
      this.rubiksCube.draw(surface.ctx, surface.offset[0], surface.offset[1], surface.scale, movement, angle);
    }
  }
}
