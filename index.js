class Scrambler {
  constructor(puzzle) {
    this.puzzle = puzzle;
  }

  generateScramble() {
    let length = this.puzzle.getScrambleLength();
    let moveset = this.__getMoveset();
    let scramble = [];
    for (let index = 0; index < length; index++) {
      scramble.push(this.__getNextMove(scramble, moveset));
    }
    return scramble;
  }

  __getMoveset() {
    let faces = this.puzzle.getFaces();
    let rotations = this.puzzle.getRotations();
    let depths = this.puzzle.getDepths();
    let moveset = [];
    faces.forEach((face) => {
      rotations.forEach((rotation) => {
        depths.forEach((depth) => {
          moveset.push(new Move(face, rotation, depth));
        });
      });
    });
    return moveset;
  }

  __getNextMove(scramble, moveset) {
    let lastMove = scramble[scramble.length - 1];
    if (lastMove) {
      let moves = moveset
        // .filter((move) => move.face.label != lastMove.face.label)
        // .filter((move) => move.face.label != lastMove.face.opposite);
      let index = Math.floor(Math.random() * moves.length);
      return moves[index];
    } else {
      let index = Math.floor(Math.random() * moveset.length);
      return moveset[index];
    }
  }
}

class Puzzle {
  getScrambleLength() {
    throw "Not Implemented";
  }

  getFaces() {
    throw "Not Implemented";
  }

  getRotations() {
    throw "Not Implemented";
  }

  getDepths() {
    throw "Not Implemented";
  }
}

class Move {
  constructor(face, rotation, depth) {
    this.face = face;
    this.rotation = rotation;
    this.depth = depth;
  }

  toString() {
    return `${this.depth > 2 ? this.depth : ""}${this.face.label}${
      this.depth > 1 ? "w" : ""
    }${this.rotation}`;
  }
}

class NbyN extends Puzzle {
  constructor(n) {
    super();
    this.n = n;
  }

  getScrambleLength() {
    return Math.max(12, 20 * (this.n - 2));
  }

  getFaces() {
    let labels = ["U", "D", "R", "L", "F", "B"];
    let faces = [];
    for (let index = 0; index < labels.length; index++) {
      const label = labels[index];
      const opposite = labels[index + (index % 2 == 0 ? 1 : -1)];
      faces.push({
        label: label,
        opposite: opposite,
      });
    }
    return faces;
  }

  getRotations() {
    return ["", "'", "2"];
  }

  getDepths() {
    let depths = [];
    for (let index = 1; index <= Math.floor(this.n / 2); index++) {
      depths.push(index);
    }
    return depths;
  }
}

function containsInverses(scramble) {
  let matchingIndices = []
  for (let i = 0; i < scramble.length - 1; i++){
    let matchFace = scramble[i].face.label == scramble[i+1].face.label;
    let matchDoubleRotation = scramble[i].rotation == "2" && scramble[i+1].rotation == "2";
    let matchOppositeRotation = scramble[i].rotation == "" && scramble[i+1].rotation == "'";
    let matchInverse = matchDoubleRotation || matchOppositeRotation;
    if (matchFace && matchInverse) {
      matchingIndices.push([i, i+1])
    }
  }
  return matchingIndices.length > 0;
}
function containsCancellation(scramble) {
  let matchingIndices = []
  for (let i = 0; i < scramble.length - 1; i++){
    if (scramble[i].face.label == scramble[i+1].face.label) {
      matchingIndices.push([i, i+1])
    }
  }
  return matchingIndices.length > 0;
}
function containsSpacedCancellation(scramble) {
  let matchingIndices = []
  for (let i = 0; i < scramble.length - 2; i++){
    if (scramble[i].face.label == scramble[i+2].face.label && scramble[i].face.opposite == scramble[i+1].face.label) {
      matchingIndices.push([i, i+2])
    }
  }
  return matchingIndices.length > 0;
}

let scrambler = new Scrambler(new NbyN(3));
const SCRAMBLE_COUNT = 100000;
let inverseCount = 0;
let cancellationCount = 0;
let spacedCancellationCount = 0;
for (let i = 0; i < SCRAMBLE_COUNT; i++) {
  let scramble = scrambler.generateScramble();
  if (containsInverses(scramble)) {
    inverseCount++;
  }
  if (containsCancellation(scramble)) {
    cancellationCount++;
  }
  if (containsSpacedCancellation(scramble)) {
    spacedCancellationCount++;
  }
}

console.log(`${inverseCount}/${SCRAMBLE_COUNT} contained inverses (${(inverseCount/SCRAMBLE_COUNT*100).toFixed(2)}%)`);
console.log(`${cancellationCount}/${SCRAMBLE_COUNT} contained cancellations (${(cancellationCount/SCRAMBLE_COUNT*100).toFixed(2)}%)`);
console.log(`${spacedCancellationCount}/${SCRAMBLE_COUNT} contained spaced cancellations (${(spacedCancellationCount/SCRAMBLE_COUNT*100).toFixed(2)}%)`);
console.log("pause");
