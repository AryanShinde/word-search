export interface IWordsearch {
    grid: string[][];
    words: string[];
    width: number;
    height: number;
}

export type GridCell = [number, number];
export type GridCellPair = [GridCell, GridCell];

export type WordMatch = GridCell[];
