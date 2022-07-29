import { WordMatch, IWordsearch, GridCell, GridCellPair } from "./types";

const DIRECTION_MAPPINGS = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
];

export class Wordsearch implements IWordsearch {
    constructor(
        public grid: string[][],
        public words: string[],
        public width: number,
        public height: number
    ) {}

    getNeighbours(cell: GridCell) {
        let neighbours: GridCell[] = [];
        for (let i = cell[0] - 1; i < cell[0] + 2; i++) {
            for (let j = cell[1] - 1; j < cell[1] + 2; j++) {
                if (cell[0] === i && cell[1] === j) {
                    continue;
                }

                if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
                    neighbours.push([i, j]);
                }
            }
        }
        return neighbours;
    }

    solve() {
        let matches: WordMatch[] = [];

        for (let word of this.words) {
            matches.push(this.findWord(word));
        }

        return matches;
    }

    compareCells(pair: GridCellPair) {
        return pair[0][0] === pair[1][0] && pair[0][1] === pair[1][1];
    }

    findLetter(letter: string) {
        let output: GridCell[] = [];

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.grid[i][j] === letter) {
                    output.push([i, j]);
                }
            }
        }

        return output;
    }

    getNeighbourCell(cell: GridCell, dir: number): GridCell | undefined {
        const offset = DIRECTION_MAPPINGS[dir];
        let i = cell[0] + offset[0];
        let j = cell[1] + offset[1];
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
            return [i, j];
        }
    }

    findWord(word: string) {
        let sPositions = this.findLetter(word[0]);
        let path: GridCell[] = [];

        for (let sPosition of sPositions) {
            console.log("start", sPosition);
            for (let i = 0; i < 8; i++) {
                console.log("dir");
                path = [sPosition];
                let l = 1;
                let currentCell = sPosition;
                while (l < word.length) {
                    let newCell = this.getNeighbourCell(currentCell, i);
                    console.log(newCell);
                    if (
                        newCell &&
                        this.grid[newCell[0]][newCell[1]] === word[l]
                    ) {
                        currentCell = newCell;
                        path.push(currentCell);
                    } else {
                        path.length = 0;
                        console.log("new");
                        break;
                    }
                    l++;
                }
                console.log("l", l);
                if (l >= word.length) return path;
            }
        }

        throw new Error("Puzzle has no solution");
        // // Array of arrays of grid positions
        // let explored: GridCell[][] = [];

        // for (let letter of word) {
        //     explored.push(this.findLetter(letter));
        // }

        // if (explored.length === 1) {
        //     if (explored[0].length > 1) {
        //         return [explored[0][0]];
        //     }

        //     return [];
        // }

        // let results: GridCellPair[] = [];
        // console.log(this.getNeighbours([0, 0]));
        // for (let index = 0; index < explored.length - 1; index++) {
        //     for (let position1 of explored[index]) {
        //         for (let position2 of explored[index + 1]) {
        //             if (
        //                 position1[0] === position2[0] &&
        //                 position1[1] === position2[1]
        //             ) {
        //                 continue;
        //             }
        //             console.log("here");

        //             for (let neighbour of this.getNeighbours(position1)) {
        //                 if (this.compareCells([neighbour, position2])) {
        //                     results.push([position1, position2]);
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        // }
        // console.log("explored", explored);

        // let startingPairs = [];

        // for (let firstPosition of explored[0]) {
        //     console.log("a");
        //     for (let pair of results) {
        //         if (
        //             this.compareCells([pair[0], firstPosition]) ||
        //             this.compareCells([pair[1], firstPosition])
        //         ) {
        //             startingPairs.push(pair);
        //         }
        //     }
        // }

        // let chains: GridCellPair[] = [];
        // for (let pair of startingPairs) {
        //     chains = Array.from(this.chains(pair, results));
        //     if (chains.length === explored.length - 1) break;
        //     if (chains.length === 0) continue;
        // }
        // if (chains.length === 0) {
        //     throw new Error("Puzzle has no solution");
        // }

        // let path = Array.from(new Set(chains.flat()));
        // path.sort();
        // return path;
    }

    *chains(pair: GridCellPair, results: GridCellPair[]) {
        const maxCell = (cells: GridCellPair) => {
            if (cells[0][0] > cells[1][0]) {
                return 0;
            } else if (cells[0][0] === cells[1][0]) {
                return cells[0][1] > cells[1][1] ? 0 : 1;
            } else {
                return 1;
            }
        };

        const getPairDirection = (cells: GridCellPair) => {
            return (
                maxCell(cells) +
                (cells[1][0] - cells[0][0]) +
                (cells[1][1] - cells[0][1])
            );
        };

        let direction = getPairDirection(pair);
        yield pair;
        while (true) {
            let i = 0;
            for (i = 0; i < results.length; i++) {
                let newPair = results[i];

                if (
                    newPair[0] === pair[1] &&
                    getPairDirection(newPair) === direction
                ) {
                    yield newPair;
                    break;
                }
            }

            if (i === 0) break;
        }
    }
}
