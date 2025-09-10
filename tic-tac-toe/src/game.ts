// A 'Type Alias' defining that a Player can only be the string "X" or "O".
// This helps prevent bugs by ensuring we don't use other values like "x" or "Player 1".
export type Player = "X" | "O";

// A Type Alias for a single cell on the board.
// It can either hold a Player's mark ("X" or "O") or be empty (null).
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

/*
 * Manages the overall state and logic of the game.
 * This class is also immutable. Methods like makeMove return a new Game instance.
 */
export class Game {
    readonly board: Board; // The current state of the board.
    readonly turn: Player; // The player whose turn it is.

    constructor(board: Board = new Board(), turn: Player = "X") {
        this.board = board;
        this.turn = turn;
    }

    // A "getter" property to easily access the winner from the board.
    get winner(): Cell {
        return this.board.winner();
    }

    // A "getter" to determine if the game has concluded (either by a win or a draw).
    get isOver(): boolean {
        return this.winner !== null || this.board.isFull();
    }

    /*
     * Processes a player's move.
     * Returns a NEW Game instance representing the state after the move.
     * If the move is illegal, it returns the same, unchanged game instance.
     */
    makeMove(i: number): Game {
        // Guard clauses: Do nothing if the game is over or the cell is already taken.
        if (this.isOver || !this.board.isCellEmpty(i)) return this;

        // Create the next board state by placing the current player's mark.
        const nextBoard = this.board.placeMark(i, this.turn);
        // Determine the next player's turn.
        const nextTurn: Player = this.turn === "X" ? "O" : "X";
        // Return a new Game instance with the updated board and turn.
        return new Game(nextBoard, nextTurn);
    }

    /* Returns a fresh game with an empty board, with 'X' starting. */
    reset(): Game {
        return new Game(new Board(), "X");
    }

    // Finds the best move for the AI by checking all empty spots and
    // scoring them with the minimax algorithm.
    private getBestMove(): number {
        type generated_Game_States = {
            indexPlaced: number;
            newGameBoard: Board;
        };

        const emptyCellIndexes = this.board.getEmptyIndices();
        let states: generated_Game_States[] = [];

        for (const idx of emptyCellIndexes) {
            let temp: generated_Game_States = {
                indexPlaced: idx,
                newGameBoard: this.board.placeMark(idx, "O"),
            };
            states.push(temp);
        }

        let maxVal = -Infinity;
        let optimalIdx = states[0].indexPlaced;

        // Iterate through all possible next moves.
        for (const state of states) {
            // Get the score for this move from the minimax function.
            const val = this.minimax(
                state.newGameBoard,
                state.newGameBoard.getEmptyIndices().length,
                false
            );

            // If this move has a better score than what we've seen so far, save it.
            if (val > maxVal) {
                maxVal = val;
                optimalIdx = state.indexPlaced;
            }
        }

        return optimalIdx;
    }

    // Tells the AI to find its best move and then plays it.
    makeAIMove(): Game {
        return this.makeMove(this.getBestMove());
    }

    // The Minimax algorithm recursively scores moves. High scores are good for
    // the AI, low scores are good for the player.
    private minimax(
        currentBoard: Board,
        depth: number,
        maximizingPlayer: boolean
    ): number {
        const w = currentBoard.winner();

        // Base Case: If the game has a winner or is a draw, return a score.
        if (w === "O") return 10 + depth; // AI wins
        if (w === "X") return -10 - depth; // Player wins
        if (depth === 0 || currentBoard.isFull()) return 0; // Draw

        const positions = currentBoard.getEmptyIndices();

        // If it's the AI's turn to think (maximizing player)...
        if (maximizingPlayer) {
            let maxVal = -Infinity;
            // ...find the move that results in the highest score.
            for (const idx of positions) {
                const child = currentBoard.placeMark(idx, "O");
                const val = this.minimax(child, depth - 1, false);
                maxVal = Math.max(maxVal, val);
            }
            return maxVal;
        }
        // If it's the player's turn to think (minimizing player)...
        else {
            let minVal = +Infinity;
            // ...find the move that results in the lowest score.
            for (const idx of positions) {
                const child = currentBoard.placeMark(idx, "X");
                const val = this.minimax(child, depth - 1, true);
                minVal = Math.min(minVal, val);
            }
            return minVal;
        }
    }
}
