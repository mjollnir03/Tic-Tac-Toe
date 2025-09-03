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
        this.cells = cells ? [...cells] : Array<Cell>(9).fill(null);
    }

    /** Read-only accessor for UI */
    get state(): ReadonlyArray<Cell> {
        return this.cells;
    }

    get(i: number): Cell {
        return this.cells[i];
    }

    isEmpty(i: number): boolean {
        return this.cells[i] === null;
    }

    isFull(): boolean {
        return this.cells.every((c) => c !== null);
    }

    winner(): Cell {
        for (const [a, b, c] of WIN_LINES) {
            const v = this.cells[a];
            if (v && v === this.cells[b] && v === this.cells[c]) return v;
        }
        return null;
    }

    /** Immutable: returns a NEW board with the move applied (if legal), else same board */
    place(i: number, player: Player): Board {
        if (!this.isEmpty(i)) return this;
        const next = [...this.cells];
        next[i] = player;
        return new Board(next);
    }

    /** Handy for AI later */
    emptyIndices(): number[] {
        const out: number[] = [];
        for (let i = 0; i < this.cells.length; i++)
            if (this.cells[i] === null) out.push(i);
        return out;
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
        if (this.isOver || !this.board.isEmpty(i)) return this;
        const nextBoard = this.board.place(i, this.turn);
        const nextTurn: Player = this.turn === "X" ? "O" : "X";
        return new Game(nextBoard, nextTurn);
    }

    /** Fresh game (X starts) */
    reset(): Game {
        return new Game(new Board(), "X");
    }
}
