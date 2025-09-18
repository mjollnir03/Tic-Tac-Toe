import { type Cell, Board, type Player } from "./board";

// Manages over game state and logic, including turns and AI moves.
// This class is immutable: methods return a new Game instance with updated state, rather than changing original instance.
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

    // A "getter" to determine if the game is over (either by a win or a draw).
    get isOver(): boolean {
        return this.winner !== null || this.board.isFull();
    }

    // Processes a player's move.
    // i is the index of the cell to place a mark (0-8).
    // returns a new Game instance with the updated state.
    makeMove(i: number): Game {
        // If the game is over or the cell is already taken, do nothing.
        if (this.isOver || !this.board.isCellEmpty(i)) return this;

        const nextBoard = this.board.placeMark(i, this.turn);
        const nextTurn: Player = this.turn === "X" ? "O" : "X";
        return new Game(nextBoard, nextTurn);
    }

    // Creates a new game instance with an empty board.
    reset(): Game {
        return new Game(new Board(), "X");
    }

    // Finds the best move for the AI using the minimax algorithm.
    private getBestMove(): number {
        // A small helper type to store an index and the resulting board after placing O.
        type generated_Game_States = {
            indexPlaced: number;
            newGameBoard: Board;
        };

        // Get all currently empty cells on the board.
        const emptyCellIndexes = this.board.getEmptyIndices();
        let states: generated_Game_States[] = [];

        // For each empty cell, simulate placing O and store the resulting board state.
        for (const idx of emptyCellIndexes) {
            let temp: generated_Game_States = {
                indexPlaced: idx,
                newGameBoard: this.board.placeMark(idx, "O"),
            };
            states.push(temp);
        }

        // Track the highest score found so far and the index that produced it.
        let maxVal = -Infinity;
        let optimalIdx = states[0].indexPlaced;

        // Check each possible move generated above.
        for (const state of states) {
            // Use minimax to score the resulting board.
            const val = this.minimax(
                state.newGameBoard,
                state.newGameBoard.getEmptyIndices().length,
                false // false because after O, it's the minimizing player's turn.
            );

            // If this move's score is better than our best so far, update.
            if (val > maxVal) {
                maxVal = val;
                optimalIdx = state.indexPlaced;
            }
        }

        // Return the index of the move with the best score.
        return optimalIdx;
    }

    // Makes a move for the AI by finding the optimal spot.
    makeAIMove(): Game {
        return this.makeMove(this.getBestMove());
    }

    // The Minimax algorithm, which recursively explores possible game outcomes to find the optimal move.
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

        // If it's the AI's turn (maximizing player)...
        if (maximizingPlayer) {
            let maxVal = -Infinity;
            // Try all possible moves for O and take the one with the highest score.
            for (const idx of positions) {
                const child = currentBoard.placeMark(idx, "O");
                const val = this.minimax(child, depth - 1, false);
                maxVal = Math.max(maxVal, val);
            }
            return maxVal;
        }
        // If it's the player's turn (minimizing player
        else {
            let minVal = +Infinity;
            // Try all possible moves for X and take the one with the lowest score.
            for (const idx of positions) {
                const child = currentBoard.placeMark(idx, "X");
                const val = this.minimax(child, depth - 1, true);
                minVal = Math.min(minVal, val);
            }
            return minVal;
        }
    }
}
