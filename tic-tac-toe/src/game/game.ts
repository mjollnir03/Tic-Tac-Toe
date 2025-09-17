import {type Cell, Board, type Player} from "./board"

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