import React, { ChangeEvent } from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

type Props = {
	draw: (ctx: CanvasRenderingContext2D, scrollFactor: number) => void,
	width: number,
	height: number,
}
type State = {
    sliderValue: string
}

export class SliderAnimation extends React.Component<Props, State> {
	canvasRef: React.RefObject<HTMLCanvasElement>;
	ctx?: CanvasRenderingContext2D;
	ticking = false;

	constructor(props: Props) {
		super(props);
		this.canvasRef = React.createRef();
        this.state = {
            sliderValue: "0"
        };
	}



	// optimisation with regard to requestAnimationFrame;
	handleChange(e: ChangeEvent<HTMLInputElement>) {
        this.props.draw(this.ctx!, +e.target.value / 100);
		this.setState({sliderValue: e.target.value})
	}

	componentDidMount() {
		this.ctx = this.canvasRef.current!.getContext("2d")!;
        this.props.draw(this.ctx!, 0);
	}

	render() {
		return (<Stack spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
			<canvas width={this.props.width} height={this.props.height} ref={this.canvasRef}></canvas>
			<input type="range" value={this.state.sliderValue} onChange={this.handleChange.bind(this)} />
		</Stack>);
	}
}
