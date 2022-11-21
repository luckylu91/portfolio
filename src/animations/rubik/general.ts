import * as math from "mathjs";

export const isometricMatrix = math.multiply(math.matrix([
	[Math.sqrt(3), -Math.sqrt(3), 0],
	[1, 1, -2],
	[Math.sqrt(2), Math.sqrt(2), Math.sqrt(2)],
]), 1 / Math.sqrt(6));
export const isometricMatrixInv = math.inv(isometricMatrix);

export const ux = [1, 0, 0];
export const uy = [0, 1, 0];
export const uz = [0, 0, 1];
export const uxNeg = [-1, 0, 0];
export const uyNeg = [0, -1, 0];
export const uzNeg = [0, 0, -1];
export const uxyz = [1, 1, 1];
export const uxyzNeg = [-1, -1, -1];
export const vx = math.multiply(isometricMatrix, ux);
export const vy = math.multiply(isometricMatrix, uy);
export const vz = math.multiply(isometricMatrix, uz);
export const vxNeg = math.multiply(isometricMatrix, uxNeg);
export const vyNeg = math.multiply(isometricMatrix, uyNeg);
export const vzNeg = math.multiply(isometricMatrix, uzNeg);
export const vxyz = math.multiply(isometricMatrix, uxyz);
export const vxyzNeg = math.multiply(isometricMatrix, uxyzNeg);