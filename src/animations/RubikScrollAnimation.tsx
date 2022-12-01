import React from "react";
import { Movement, parseMovementString, reversedMovement } from "./rubik/utils/movements";
import { RubiksCube } from "./rubik/RubiksCube";
import {  ScrollState } from "../App";

type Props = {
  movementString: string,
}
type State = {
  top: string,
  alpha: number,
  scrollY: number,
}

export class RubikScrollAnimation extends React.Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  // containerRef: React.RefObject<HTMLDivElement>;
  ctx?: CanvasRenderingContext2D;
  ticking = false;
  rubiksCube?: RubiksCube;
  currentMovementIndex: number = 0;
  currentMovementCompletion: number = 0;
  offset?: number[];
  scale?: number;
  movements: Movement[] | null = null;
  drawRequested: boolean = false;
  size: number = 0;
  top: string = "0";

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      top: "0",
      alpha: 0,
      scrollY: 0
    }
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current!.getContext("2d")!;
    this.updateSize();
    this.rubiksCube = new RubiksCube();
    this.initialize();
    this.draw();
    document.addEventListener("scroll", this.handleScrollChange.bind(this));
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    this.updateSize();
    this.rubiksCube!.reset();
    this.initialize();
    this.draw();
  }

  componentWillUnmount(): void {
    document.removeEventListener("scroll", this.handleScrollChange.bind(this));
  }

  updateSize() {
    this.size = this.canvasRef.current!.width;
    console.log(this.size);
    this.canvasRef.current!.height = this.size;
    this.offset = [this.size / 2, this.size / 2];
    this.scale = this.size / (2 * Math.sqrt(3));
  }


  initialize() {
    this.currentMovementIndex = 0;
    this.movements = parseMovementString(this.props.movementString);
    if (this.movements !== null) {
      this.movements.slice().reverse().forEach(movement => this.rubiksCube!.rotate(reversedMovement(movement)));
      this.updateCubeFromScroll();
    }
  }

  updateCubeFromScroll() {
    const sliderValue = this.state.alpha * this.movements!.length;
    const newMovementIndex = this.state.alpha < 1 ? Math.floor(sliderValue) : this.movements!.length - 1;
    this.moveTo(newMovementIndex);
    this.currentMovementCompletion = this.state.alpha < 1 ? sliderValue - Math.floor(sliderValue) : 1;
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

  // optimisation with regard to requestAnimationFrame;
  handleScrollChange(e: Event) {
    e.preventDefault();
    const maxScrollY = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    ) - window.innerHeight;
    const scrollY = window.scrollY;
    const alpha = scrollY / maxScrollY;
    // this.canvasRef.current!.style.top = alpha * (1 - this.size / maxScrollY) * 100 + "%";
    // this.top = alpha * (1 - this.size / maxScrollY) * 100 + "%";
    this.setState({
      top: alpha * (1 - this.size / maxScrollY) * 100 + "%",
      alpha,
      scrollY,
    });
    if (!this.drawRequested) {
      requestAnimationFrame(() => {
        if (this.movements === null)
          return;
        this.drawRequested = false;
        this.updateCubeFromScroll();
        this.draw();
      })
    }
    this.drawRequested = true;
  }


  draw() {
    this.ctx!.strokeStyle = "black";
    this.ctx!.fillStyle = "grey";
    this.ctx!.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
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
            top: this.state.top,
            // top: 0,
          }}
        />
     // </div>
    );
  }
}

