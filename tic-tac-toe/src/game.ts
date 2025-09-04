// game.ts
export type Player = "X" | "O";
export type Cell = Player | null;

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

export class Board {
    private readonly cells: ReadonlyArray<Cell>;

    constructor(cells?: ReadonlyArray<Cell>) {
        if (cells) {
            this.cells = [...cells];
        } else {
            this.cells = Array<Cell>(9).fill(null);
        }
    }

    getBoard(): ReadonlyArray<Cell> {
        return this.cells;
    }

    getCell(i: number): Cell {
        return this.cells[i];
    }

    isCellEmpty(i: number): boolean {
        return this.cells[i] === null;
    }

    isBoardEmpty(): boolean {
        return this.cells.every((c) => c === null);
    }

    isFull(): boolean {
        return this.cells.every((c) => c !== null);
    }

    winner(): Cell {
        // Check each of the 8 possible winning lines
        for (const line of WIN_LINES) {
            const [first, second, third] = line;

            // Get the value of the first cell in the line ('X', 'O', or null)
            const firstCell = this.cells[first];

            // A line can only be a winner if the first cell is not empty
            // and all three cells in the line are the same.
            if (
                firstCell &&
                firstCell === this.cells[second] &&
                firstCell === this.cells[third]
            ) {
                // We have a winner, so we return the player ('X' or 'O')
                return firstCell;
            }
        }

        // If the loop finishes without finding a winning line, return null
        return null;
    }

    /** Immutable: returns a NEW board with the move applied (if legal), else same board */
    placeMark(i: number, player: Player): Board {
        if (!this.isCellEmpty(i)) return this;
        const next = [...this.cells];
        next[i] = player;
        return new Board(next);
    }
}

export class Game {
    readonly board: Board;
    readonly turn: Player;

    constructor(board: Board = new Board(), turn: Player = "X") {
        this.board = board;
        this.turn = turn;
    }

    get winner(): Cell {
        return this.board.winner();
    }

    get isOver(): boolean {
        return this.winner !== null || this.board.isFull();
    }

    /** Immutable: returns a NEW Game after attempting a move */
    makeMove(i: number): Game {
        if (this.isOver || !this.board.isCellEmpty(i)) return this;
        const nextBoard = this.board.placeMark(i, this.turn);
        const nextTurn: Player = this.turn === "X" ? "O" : "X";
        return new Game(nextBoard, nextTurn);
    }

    /** Fresh game (X starts) */
    reset(): Game {
        return new Game(new Board(), "X");
    }
}
