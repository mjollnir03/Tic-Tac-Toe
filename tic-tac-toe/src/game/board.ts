export type Player = "X" | "O";

export type Cell = Player | null;

// This is a constant array holding all 8 possible winning combinations.
// Each inner array contains the three cell indices that form a winning line.
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

/*
 * Represents the 3x3 Tic-Tac-Toe board.
 * This class is immutable, meaning its methods don't change the board's state;
 * instead, they return a new Board instance with the updated state.
 */
export class Board {
    // A private, read-only array representing the 9 cells of the grid.
    private readonly cells: ReadonlyArray<Cell>;

    constructor(cells?: ReadonlyArray<Cell>) {
        // If an array of cells is provided, clone it for the new board.
        // Otherwise, create a new board with 9 empty (null) cells.
        if (cells) {
            this.cells = [...cells];
        } else {
            this.cells = Array<Cell>(9).fill(null);
        }
    }

    // Returns a read-only version of the board's cells.
    getBoard(): ReadonlyArray<Cell> {
        return this.cells;
    }

    // Returns the value of a single cell at a given index.
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

            // If the first cell isn't empty and all three cells in the line match...
            if (
                firstCell &&
                firstCell === this.cells[second] &&
                firstCell === this.cells[third]
            ) {
                // ...we have a winner! Return the player ('X' or 'O').
                return firstCell;
            }
        }
        // If the loop completes, no winner was found, so return null.
        return null;
    }

    /*
     * Places a player's mark on the board.
     * This is an immutable operation: it returns a NEW board with the move applied.
     * If the move is illegal (cell not empty), it returns the same, unchanged board.
     */
    placeMark(i: number, player: Player): Board {
        if (!this.isCellEmpty(i)) return this; // Return original board if cell is taken.
        const nextCells = [...this.cells]; // Create a copy of the cells array.
        nextCells[i] = player; // Place the mark in the copy.
        return new Board(nextCells); // Return a new Board instance with the copied array.
    }

    // Finds all empty cells on the board and returns their indexes.
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