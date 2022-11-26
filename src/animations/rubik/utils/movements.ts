// Movement type

export type Movement = {
  rotAxis: number,
  positiveDirection: boolean,
  middle: boolean,
};

export function defaultMovement(): Movement {
  return {
    rotAxis: 0,
    positiveDirection: true,
    middle: true,
  }
}

// Parsing

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

export function movementFromNotation(notation: string) {
  let rotAxis, positiveDirection = true, middle = false;
  const letter = notation[0];

  if (movementNotations.has(letter)) {
    rotAxis = movementNotations.get(letter)!;
  }
  else {
    middle = true;
    rotAxis = movementSliceNotations.get(letter)!;
  }
  if (notation.length >= 2) {
    positiveDirection = false;
  }

  return {
    rotAxis,
    middle,
    positiveDirection
  };
}

export function reversedMovement(movement: Movement): Movement {
  const movementR = {...movement};
  movementR.positiveDirection = !movementR.positiveDirection;
  return movementR;
}

const movementRegex = /^[RFULBDSME]'?/;

export function parseMovementString(s: string): Movement[] | null {
  const movements = [];
  do {
    const match = s.match(movementRegex);
    if (match === null) {
      return null;
    }
    movements.push(movementFromNotation(match[0]));
    s = s.slice(match[0].length);
  } while (s.length > 0);
  return movements;
}
