import React from "react";
import { ScrollAnimation } from "..";
import * as math from "mathjs";
import { isometricMatrix, vx, vy, vz } from "./general";
import { rotationFromNotation, RubikState } from "./RubikState";
import { SliderAnimation } from "../SliderAnimation";

type Props = {
  size: number
};
type State = {};

function drawVector(ctx: CanvasRenderingContext2D, x: number, y: number, v: math.Matrix, color: string) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(math.floor(x + v.get([0])), Math.floor(y + v.get([1])));
  ctx.stroke();
}

/**
 *   |y
 * z/ \x
 */
export class RubikAnimation extends React.Component<Props, State> {
  faces: math.Matrix[][];
  scale: number;
  offset: number[];
  state = new RubikState();

  constructor(props: Props) {
    super(props);
    this.faces = [1, 1/3, -1/3, -1].map(
      x => [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(yz =>
        math.multiply(isometricMatrix, math.matrix([x, yz[0], yz[1]]))
      )
    );
    this.scale = this.props.size / (2 * Math.sqrt(3));
    this.offset = [this.props.size / 2, this.props.size / 2];
    this.state.setMovement(rotationFromNotation("D'"));
    this.state.completeMovement();
  }

  draw(ctx: CanvasRenderingContext2D, scrollFactor: number) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawVector(ctx, 10, 10, math.multiply(vx, 10), "#ff0000");
    drawVector(ctx, 10, 10, math.multiply(vy, 10), "#00ff00");
    drawVector(ctx, 10, 10, math.multiply(vz, 10), "#0000ff");

    this.state.move(scrollFactor);
    this.state.draw(ctx, this.offset[0], this.offset[1], this.scale);
  }

  render() {
    return <SliderAnimation width={this.props.size} height={this.props.size} draw={this.draw.bind(this)} />
  }
}
