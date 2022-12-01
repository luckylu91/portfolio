import React from "react";
import { Movement, parseMovementString, reversedMovement } from "./rubik/utils/movements";
import { RubiksCube } from "./rubik/RubiksCube";
import {  ScrollState } from "../App";

type Props = {
  movementString: string,
}
type State = {
  // top: string,
  // alpha: number,
  // scrollY: number,
}

export class RubikScrollAnimation extends React.Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D;
  rubiksCube?: RubiksCube;
  currentMovementIndex: number = 0;
  currentMovementCompletion: number = 0;
  offset?: number[];
  scale?: number;
  movements: Movement[] | null = null;
  drawRequested: boolean = false;
  size: number = 0;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current!.getContext("2d")!;
    document.addEventListener("scroll", this.handleScrollChange.bind(this));
    this.rubiksCube = new RubiksCube();
    this.initialize();
    this.handleScrollChange();
    this.draw();
  }

  componentDidUpdate(): void {
    this.rubiksCube!.reset();
    this.initialize();
    this.handleScrollChange();
    this.draw();
  }

  componentWillUnmount(): void {
    document.removeEventListener("scroll", this.handleScrollChange.bind(this));
  }

  initialize() {
    // Dimentions
    this.size = this.canvasRef.current!.width;
    this.canvasRef.current!.height = this.size;
    this.offset = [this.size / 2, this.size / 2];
    this.scale = this.size / (2 * Math.sqrt(3));

    // Cube state
    this.currentMovementIndex = 0;
    this.movements = parseMovementString(this.props.movementString);
    if (this.movements !== null) {
      this.movements.slice().reverse().forEach(movement => this.rubiksCube!.rotate(reversedMovement(movement)));
      this.update();
    }
  }

  update() {
    const alpha = window.scrollY / this.getMaxScrollY();
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

  getMaxScrollY() {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    ) - window.innerHeight;
  }

  // optimisation with regard to requestAnimationFrame;
  handleScrollChange(e?: Event) {
    e?.preventDefault();
    if (!this.drawRequested) {
      requestAnimationFrame(() => {
        if (this.movements === null)
          return;
        const alpha = window.scrollY / this.getMaxScrollY();
        this.canvasRef.current!.style.top = alpha * (window.innerHeight - this.canvasRef.current!.offsetHeight) + "px";
        this.drawRequested = false;
        this.update();
        this.draw();
      })
    }
    this.drawRequested = true;
  }


  draw() {
    this.ctx!.clearRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
    if (this.movements!.length == 0) {
      this.rubiksCube!.draw(this.ctx!, this.offset![0], this.offset![1], this.scale!);
    }
    else {
      const movement = this.movements![this.currentMovementIndex];
      const angle = (movement.positiveDirection ? +1 : -1) * Math.PI / 2 * this.currentMovementCompletion;
      this.rubiksCube!.draw(this.ctx!, this.offset![0], this.offset![1], this.scale!, movement, angle);
    }
  }


  render() {
    return (
      // <div>
        <canvas
          className="rubik-anim"
          ref={this.canvasRef}
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            // top: 0,
          }}
        />
     // </div>
    );
  }
}

