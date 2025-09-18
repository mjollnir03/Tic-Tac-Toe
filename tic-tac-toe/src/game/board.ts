// TYPE DEFINITIONS
export type Player = "X" | "O";
export type Cell = Player | null;

// A constant array of all 8 possible winning combinations of cell indices.
const WIN_LINES: [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diags
];

// Represents the state of the 3x3 Tic-Tac-Toe board.
// This class is immutable: its methods return a new Board instance with the updated state, rather than changing the original one.
export class Board {
    // A private array representing the 9 cells of the grid.
    private readonly cells: ReadonlyArray<Cell>;

    constructor(cells?: ReadonlyArray<Cell>) {
        // If an array of cells is provided, use it. Otherwise, create an empty board.
        if (cells) {
            this.cells = [...cells];
        } else {
            this.cells = Array<Cell>(9).fill(null);
        }
    }

    // Returns the current state of the board's cells.
    getBoard(): ReadonlyArray<Cell> {
        return this.cells;
    }

    // Returns the value of a cell at a given index.
    getCell(i: number): Cell {
        return this.cells[i];
    }

    // Checks if a cell at a given index is empty (null).
    isCellEmpty(i: number): boolean {
        return this.cells[i] === null;
    }

    // Checks if the entire board is empty.
    isBoardEmpty(): boolean {
        return this.cells.every((c) => c === null);
    }

    // Checks if all cells on the board have been filled.
    isFull(): boolean {
        return this.cells.every((c) => c !== null);
    }

    // Determines if there is a winner by checking all winning lines.
    winner(): Cell {
        // Loop through each of the 8 possible winning lines.
        for (const line of WIN_LINES) {
            const [first, second, third] = line;
            const firstCell: Cell = this.cells[first];

            // If the first cell isn't empty and all three cells in the line match.
            if (
                firstCell &&
                firstCell === this.cells[second] &&
                firstCell === this.cells[third]
            ) {
                // Found a winner.
                return firstCell;
            }
        }
        // If the loop completes, no winner was found, so return null.
        return null;
    }

    // Places a player's mark on the board.
    placeMark(i: number, player: Player): Board {
        if (!this.isCellEmpty(i)) return this; // Return original board if cell is taken.
        const nextCells = [...this.cells]; // Create a copy of the cells array.
        nextCells[i] = player; // Place the mark in the copy.
        return new Board(nextCells); // Return a new Board instance with the copied array.
    }

    // Returns an array of indices for all empty cells.
    getEmptyIndices(): number[] {
        const result: number[] = [];
        for (let i = 0; i < 9; i++) {
            if (this.cells[i] === null) {
                result.push(i);
            }
        }
        return result;
    }
}
