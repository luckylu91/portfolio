import { movementNotations, movementSliceNotations } from "./movements";

const possibleMovements = [...movementNotations.keys(), ...movementSliceNotations.keys()];
const N = possibleMovements.length;

export function generateMovementString() {
  let movements = [];
  let lastIndex: number | undefined;
  const size = Math.floor(Math.random() * 3 + 5);
  for (let i = 0; i < size; i++) {
    let j;
    if (i == 0) {
      j = Math.floor(Math.random() * 2 * N);
    }
    else {
      const fList = forbiddenMovements.get(lastIndex!)!;
      j = Math.floor(Math.random() * (2 * N - fList.length));
      for (const f of fList) {
        if (j >= f) {
          j++;
        }
      }
    }
    const movement = possibleMovements[j % N] + (j < N ? "" : "'");
    movements.push(movement);
    lastIndex = j;
    console.log(movement);
  }
  return movements.join("");
}

function oppositeIndex(j: number) {
  return j < N ? j + N : j - N;
}

const axisGroupedMovements = [
  ["R", "L'", "S"],
  ["F", "B'", "M"],
  ["U", "D'", "E"],
]

const forbiddenMovements = new Map<number, number[]>();

for (let axisGroup of axisGroupedMovements) {
  let axisGroupIndices = axisGroup.map(mov =>
    possibleMovements.indexOf(mov[0]) + (mov.endsWith("'") ? N : 0)
  );
  for (let i = 0; i < axisGroup.length; i++) {
    const movementIndex = axisGroupIndices[i];
    const fList = axisGroupIndices.filter((_, k) => k != i);
    forbiddenMovements.set(movementIndex, fList);
  }
}

for (const [i, fList] of [...forbiddenMovements.entries()]) {
  const iOpposite = oppositeIndex(i);
  forbiddenMovements.set(iOpposite, fList.map(k => k + N));
  forbiddenMovements.get(i)!.push(iOpposite);
  forbiddenMovements.get(iOpposite)!.push(i);
}

for (const fList of forbiddenMovements.values()) {
  fList.sort();
}
