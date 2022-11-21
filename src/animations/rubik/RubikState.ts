import * as math from "mathjs";
import { hasUncaughtExceptionCaptureCallback } from "process";
import { TypeOfExpression } from "typescript";
import { vx, vxNeg, vxyz, vxyzNeg, vy, vyNeg, vz, vzNeg } from "./general";

type Rotation = {
    axis: math.Matrix,
    otherAxis: [math.Matrix, math.Matrix],
    angle: number,
};
const mainNormals: [math.Matrix, [math.Matrix, math.Matrix]][] = [
	[vx, [vyNeg, vz]],
	[vy, [vx, vz]],
	[vz, [vx, vy]],
	[vxNeg, [vy, vzNeg]],
	[vyNeg, [vxNeg, vzNeg]],
	[vzNeg, [vxNeg, vyNeg]]
];
const initialFacetColors = generateFacetColors();
const initialFacetVertices = generateFacetPositions();
const initialFacetNormals = generateFacetNormals();

function axisFromIndex(axisIndex: number): math.Matrix {
	return mainNormals[axisIndex][0];
}

function otherAxisFromIndex(axisIndex: number): [math.Matrix, math.Matrix] {
	return mainNormals[axisIndex][1];
}

export class RubikState {
	facetColors: string[][][];
	facetVertices: math.Matrix[][][][]; // face, row, col, points
	facetNormals: math.Matrix[][][];
	currentRotation?: Rotation;

	constructor() {
		this.facetColors = generateFacetColors();
		this.facetVertices = generateFacetPositions();
		this.facetNormals = generateFacetNormals();
	}

	rotateMid(coef: number) {
		this.currentRotation = {
			axis: axisFromIndex(2),
			otherAxis: otherAxisFromIndex(2),
			angle: coef * Math.PI / 2
		};
		for (let iFace of [0, 1, 3, 4]) {
			for (let x = 0; x < 3; x++) {
				for (let i = 0; i < 4; i++) {
					this.facetVertices[iFace][x][1][i] = math.rotate(initialFacetVertices[iFace][x][1][i], this.currentRotation!.angle, this.currentRotation!.axis);
				}
				this.facetNormals[iFace][x][1] = math.rotate(initialFacetNormals[iFace][x][1], this.currentRotation!.angle, this.currentRotation!.axis);
			}
		}
	}

	draw(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, scale: number) {
		this.drawFiltered(ctx, offsetX, offsetY, scale, (iFace: number, x: number, y: number) => iFace == 5 || (iFace != 2 && y == 0));
		this.drawInterstice(ctx, offsetX, offsetY, scale, 2, -1);
		this.drawFiltered(ctx, offsetX, offsetY, scale, (iFace: number, x: number, y: number) => iFace != 2 && iFace != 5 && y == 1);
		this.drawInterstice(ctx, offsetX, offsetY, scale, 2, 1, this.currentRotation);
		this.drawFiltered(ctx, offsetX, offsetY, scale, (iFace: number, x: number, y: number) => iFace == 2 || (iFace != 5 && y == 2));
	}

	drawFiltered(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, scale: number, filter?: (iFace: number, x: number, y: number) => boolean) {
		for (let iFace = 0; iFace < 6; iFace++) {
			for (let x = 0; x < 3; x++) {
				for (let y = 0; y < 3; y++) {
					if (filter && !filter(iFace, x, y))
						continue;
					if (this.facetNormals[iFace][x][y].get([2]) < 0)
						continue;
					drawOnePolygon(ctx, this.facetVertices[iFace][x][y], this.facetColors[iFace][x][y], scale, offsetX, offsetY);
				}
			}
		}
	}

	drawInterstice(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, scale: number, axisIndex: number, direction: number, rotation?: Rotation) {
		if (this.currentRotation === undefined) {
			return ;
		}
		const polygon = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(d12 => {
			const [d1, d2] = d12;
			const d3 = 1 / 3 * Math.sign(direction);
			const v3 = axisFromIndex(axisIndex);
			const [v1, v2] = otherAxisFromIndex(axisIndex);
			let p = math.add(
				math.multiply(v1, d1),
				math.multiply(v2, d2)
			);
			p = math.add(p, math.multiply(v3, d3));
            if (rotation !== undefined) {
                p = math.rotate(p, this.currentRotation!.angle, this.currentRotation!.axis);
            }
			return p;
		});
		drawOnePolygon(ctx, polygon, "black", scale, offsetX, offsetY);
	}
}

function drawOnePolygon(ctx: CanvasRenderingContext2D, polygon: math.Matrix[], color: string, scale: number, offsetX: number, offsetY: number) {
	ctx.fillStyle = color;
		ctx.beginPath();
		for (let j = 0; j < polygon.length; j++) {
			let vertex = polygon[j];
			const x = vertex.get([0]) * scale + offsetX;
			const y = vertex.get([1]) * scale + offsetY;
			if (j == 0)
				ctx.moveTo(x, y);
			else
				ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.fill();
}

function generateFacetPositions(): math.Matrix[][][][] {
	return mainNormals.map((vBase, i) => {
		let faceNormale = vBase[0];
		let [faceUx, faceUy] = vBase[1];
		return [-1, -1/3, 1/3].map(x => {
			return [-1, -1/3, 1/3].map(y => {
				return [[0, 0], [0, 1], [1, 1], [1, 0]].map(dxdy => {
					const dx = dxdy[0];
					const dy = dxdy[1];
					let p = math.add(
						math.multiply(faceUx, x + dx * 2/3),
						math.multiply(faceUy, y + dy * 2/3),
					);
					p = math.add(
						p,
						faceNormale,
					);
					return p;
				});
			})
		});
	});
}

function generateFacetColors(): string[][][] {
	return ["red", "blue", "white", "orange", "green", "yellow"].map(c =>
		Array.from({length: 3}, () => Array.from({length: 3}, () => c))
	);
}

function generateFacetNormals(): math.Matrix[][][] {
	return mainNormals.map(v =>
		Array.from({length: 3}, () => Array.from({length: 3}, () => v[0]))
	);
}

const movementNotations = new Map([
    ["R", 0],
    ["F", 1],
    ["U", 2],
    ["L", 3],
    ["B", 4],
    ["D", 5],
]);
const movementSliceNotations = new Map([
    ["S", 0],
    ["M", 1],
    ["E", 2],
]);
type Movement = {
    axisIndex: number,
    direction: number,
    rowIndex: number
}
function rotationFromNotation(rotationStr: string): Movement {
    let axisIndex, direction = 1, rowIndex = 0;
    const letter = rotationStr[0];

    if (movementNotations.has(letter)) {
        axisIndex = movementNotations.get(letter)!;
        if (axisIndex >= 3) {
            axisIndex -= 3;
            direction = -1;
            rowIndex = 2;
        }
    }
    else {
        axisIndex = movementSliceNotations.get(letter)!;
        rowIndex = 1;
    }
    if (rotationStr.length >= 2) {
        direction *= -1;
    }

    return {
        axisIndex,
        direction,
        rowIndex
    };
}
