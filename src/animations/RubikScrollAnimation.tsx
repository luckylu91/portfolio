import React, { ChangeEvent } from "react";
import Stack from "@mui/material/Stack";
import { Movement, parseMovementString, reversedMovement } from "./rubik/utils/movements";
import { RubiksCube } from "./rubik/RubiksCube";
import * as math from "mathjs";
import "./RubikScrollAnimation.css";

type Props = {
  size: number,
  movementString: string,
}
type State = {}

export class RubikScrollAnimation extends React.Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D;
  ticking = false;
  rubiksCube?: RubiksCube;
  currentMovementIndex: number = 0;
  currentMovementCompletion: number = 0;
  offset: number[];
  scale: number;
  movements: Movement[] | null = null;
  drawRequested: boolean = false;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
    this.offset = [this.props.size / 2, this.props.size / 2];
    this.scale = this.props.size / (2 * Math.sqrt(3));
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current!.getContext("2d")!;
    this.initialize();
    this.draw();
    document.addEventListener("scroll", this.handleScrollChange.bind(this));
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    this.initialize();
    this.draw();
  }

  componentWillUnmount(): void {
    document.removeEventListener("scroll", this.handleScrollChange.bind(this));
  }


  initialize() {
    this.rubiksCube = new RubiksCube();
    this.currentMovementIndex = 0;
    this.movements = parseMovementString(this.props.movementString);
    if (this.movements !== null) {
      this.movements.slice().reverse().forEach(movement => this.rubiksCube!.rotate(reversedMovement(movement)));
      this.updateCubeFromScroll();
    }
  }

  updateCubeFromScroll() {
    const maxScrollY = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    ) - window.innerHeight;
    const scrollY = window.scrollY;
    const alpha = scrollY / maxScrollY;
    const sliderValue = alpha * this.movements!.length;
    const newMovementIndex = alpha < 1 ? Math.floor(sliderValue) : this.movements!.length - 1;
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


  animate() {
    if (this.movements === null)
      return;
    this.drawRequested = false;
    this.updateCubeFromScroll();
    this.draw();
  }

  // optimisation with regard to requestAnimationFrame;
  handleScrollChange(e: Event) {
    e.preventDefault();
    if (!this.drawRequested) {
      requestAnimationFrame(this.animate.bind(this))
    }
    this.drawRequested = true;
  }

  draw() {
    this.ctx!.strokeStyle = "black";
    this.ctx!.fillStyle = "grey";
    this.ctx!.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
    if (this.movements!.length == 0) {
      this.rubiksCube!.draw(this.ctx!, this.offset[0], this.offset[1], this.scale);
    }
    else {
      const movement = this.movements![this.currentMovementIndex];
      const angle = (movement.positiveDirection ? +1 : -1) * Math.PI / 2 * this.currentMovementCompletion;
      this.rubiksCube!.draw(this.ctx!, this.offset[0], this.offset[1], this.scale, movement, angle);
    }
  }


  render() {
    return <canvas
      className="rubik-anim"
      ref={this.canvasRef}
      width={this.props.size}
      height={this.props.size}
    />;
  }
}
