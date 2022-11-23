import React from "react";
import * as math from "mathjs";
import { isometricMatrix, vx, vy, vz } from "./general";
import { Movement, movementFromNotation, RubiksCube } from "./UnitCube";

type Props = {
  size: number,
  movementNotation: string
};
type State = {};

export class RubikAnimation extends React.Component<Props, State> {
  faces: math.Matrix[][];
  scale: number;
  offset: number[];
//   state = new RubikState();
  rubiksCube = new RubiksCube();
  movement?: Movement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
    this.faces = [1, 1/3, -1/3, -1].map(
      x => [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(yz =>
        math.multiply(isometricMatrix, math.matrix([x, yz[0], yz[1]]))
      )
    );
    this.scale = this.props.size / (2 * Math.sqrt(3));
    this.offset = [this.props.size / 2, this.props.size / 2];
    // this.movement = movementFromNotation(this.props.movementNotation);
    // this.rubiksCube.rotate(this.movement);
    // console.log(JSON.stringify(this.movement));
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current!.getContext("2d")!;
    this.draw(this.ctx!, 0);
  }

  componentDidUpdate() {
    // console.log("UPDATE");
    const s = this.props.movementNotation;
    if (s && s.length > 0 && "UDFBRLMES".includes(s[0])) {
      this.movement = movementFromNotation(this.props.movementNotation);
      this.rubiksCube.rotate(this.movement);
      this.draw(this.ctx!, 0);
    }
  }

  draw(ctx: CanvasRenderingContext2D, scrollFactor: number) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawVector(ctx, 10, 10, math.multiply(vx, 10), 255, 0, 0);
    drawVector(ctx, 10, 10, math.multiply(vy, 10), 0, 255, 0);
    drawVector(ctx, 10, 10, math.multiply(vz, 10), 0, 0, 255);

    // this.state.move(scrollFactor);
    // this.state.draw(ctx, this.offset[0], this.offset[1], this.scale);
    // this.rubiksCube.draw(ctx, this.offset[0], this.offset[1], this.scale, this.movement, scrollFactor * Math.PI / 2);
    this.rubiksCube.draw(ctx, this.offset[0], this.offset[1], this.scale);
  }

  render() {
    // return <SliderAnimation width={this.props.size} height={this.props.size} draw={this.draw.bind(this)} />
    return <canvas width={this.props.size} height={this.props.size} ref={this.canvasRef}></canvas>;
  }
}

function drawVector(ctx: CanvasRenderingContext2D, x: number, y: number, v: math.Matrix, r: number, g: number, b: number) {
  if (v.get([2]) < 0) {
    [r, g, b] = [r, g, b].map(val => Math.floor(val / 2));
  }
  ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(math.floor(x + v.get([0])), Math.floor(y + v.get([1])));
  ctx.stroke();
}
