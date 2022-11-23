import React, { ChangeEvent } from "react";
import Stack from "@mui/material/Stack";
import { Movement } from "./rubik/utils";
import { RubiksCube } from "./rubik/RubiksCube";
import * as math from "mathjs";

type Props = {
  size: number,
  movements: Movement[],
}
type State = {
  sliderValueStr: string
}

export class RubikSliderAnimation extends React.Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D;
  ticking = false;
  rubiksCube: RubiksCube = new RubiksCube();
  currentMovementIndex: number = 0;
  currentMovementCompletion: number = 0;
  offset: number[];
  scale: number;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
        sliderValueStr: "0"
    };
    this.offset = [this.props.size / 2, this.props.size / 2];
    this.scale = this.props.size / (2 * Math.sqrt(3));
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current!.getContext("2d")!;
    this.draw();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // if (prevState.sliderValueStr != "0") {
    //   this.setState({
    //     sliderValueStr: "0"
    //   });
    // }
    // this.rubiksCube = new RubiksCube();
    this.draw();
  }

  // optimisation with regard to requestAnimationFrame;
  handleSliderChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({sliderValueStr: e.target.value});

    const alpha = +e.target.value / 100;
    const sliderValue = alpha * this.props.movements.length;
    const newMovementIndex = alpha < 1 ? Math.floor(sliderValue) : this.props.movements.length - 1;
    this.moveTo(newMovementIndex);
    this.currentMovementCompletion = alpha < 1 ? sliderValue - Math.floor(sliderValue) : 1;
    this.draw();
  }

  private moveTo(newMovementIndex: number) {
    let movements: Movement[] = [];
    if (newMovementIndex > this.currentMovementIndex) {
      movements = this.props.movements
        .slice(this.currentMovementIndex, newMovementIndex)
        .map(movement => { return {...movement}; });
    }
    else if (newMovementIndex < this.currentMovementIndex) {
      movements = this.props.movements
        .slice(newMovementIndex, this.currentMovementIndex)
        .reverse()
        .map(movement => {
          const movementClone = {...movement};
          movementClone.positiveDirection = !movementClone.positiveDirection;
          return movementClone;
        });
    }
    for (let movement of movements) {
      this.rubiksCube.rotate(movement);
    }
    this.currentMovementIndex = newMovementIndex;
  }


  draw() {
    this.ctx!.strokeStyle = "black";
    this.ctx!.fillStyle = "grey";
    this.ctx!.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
    // drawVector(this.ctx!, 10, 10, math.multiply(vx, 10), 255, 0, 0);
    // drawVector(this.ctx!, 10, 10, math.multiply(vy, 10), 0, 255, 0);
    // drawVector(this.ctx!, 10, 10, math.multiply(vz, 10), 0, 0, 255);
    if (this.props.movements.length == 0) {
      this.rubiksCube.draw(this.ctx!, this.offset[0], this.offset[1], this.scale);
    }
    else {
      const movement = this.props.movements[this.currentMovementIndex];
      const angle = (movement.positiveDirection ? +1 : -1) * Math.PI / 2 * this.currentMovementCompletion;
      this.rubiksCube.draw(this.ctx!, this.offset[0], this.offset[1], this.scale, movement, angle);
    }
  }


  render() {
    return (<Stack spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
      <canvas width={this.props.size} height={this.props.size} ref={this.canvasRef}></canvas>
      <input type="range" value={this.state.sliderValueStr} onChange={this.handleSliderChange.bind(this)} />
    </Stack>);
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
