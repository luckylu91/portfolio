import React from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

type Props = {
	draw: (ctx: CanvasRenderingContext2D, scrollFactor: number) => void,
	width: number,
	height: number,
}
type State = {}

export class SliderAnimation extends React.Component<Props, State> {
	canvasRef: React.RefObject<HTMLCanvasElement>;
	ctx?: CanvasRenderingContext2D;
	ticking = false;

	constructor(props: Props) {
		super(props);
		this.canvasRef = React.createRef();
	}

	// optimisation with regard to requestAnimationFrame;
	handleChange(_: Event | undefined, value: number | number[]) {
		if (!this.ticking) {
			window.requestAnimationFrame(() => {
				this.props.draw(this.ctx!, value as number);
				this.ticking = false;
			});
			this.ticking = true;
		}
	}

	componentDidMount() {
		this.ctx = this.canvasRef.current!.getContext("2d")!;
		this.handleChange(undefined, 0);
	}

	render() {
		return (<Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
			<canvas width={this.props.width} height={this.props.height} ref={this.canvasRef}></canvas>
			<Slider value={0} onChange={this.handleChange.bind(this)} />
		</Stack>);
	}
}
