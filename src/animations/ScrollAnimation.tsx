import React, { useEffect } from "react";

type Props = {
	draw: (ctx: CanvasRenderingContext2D, scrollFactor: number) => void,
	width: number,
	height: number,
}
type State = {}

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export class ScrollAnimation extends React.Component<Props, State> {
	canvasRef: React.RefObject<HTMLCanvasElement>;
	ctx?: CanvasRenderingContext2D;
	lastKnownElementRect?: DOMRect;
	ticking = false;

	constructor(props: Props) {
		super(props);
		this.canvasRef = React.createRef();
	}

	// scroll optimisation with regard to requestAnimationFrame;
	handleScroll() {
		this.lastKnownElementRect = this.canvasRef.current!.getBoundingClientRect();

		if (!this.ticking) {
			window.requestAnimationFrame(() => {
				this.props.draw(this.ctx!, computeScrollFactor(this.lastKnownElementRect!));
				this.ticking = false;
			});
			this.ticking = true;
		}
	}

	componentDidMount() {
		this.ctx = this.canvasRef.current!.getContext("2d")!;
		window.addEventListener("scroll", this.handleScroll.bind(this));
		this.handleScroll();
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll.bind(this))
	}


	render() {
		return <canvas width={this.props.width} height={this.props.height} ref={this.canvasRef}></canvas>;
	}
}

function computeScrollFactor(rect: DOMRect) {
	return (window.innerHeight - rect.top) / window.innerHeight;
}

