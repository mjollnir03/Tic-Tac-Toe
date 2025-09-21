import "./styles/App.css";
import { useEffect, useRef, useState } from "react";
import { type Cell } from "./game/board";
import { Game } from "./game/game";
import ScoreCard from "./components/ScoreCard";
import BoardView from "./components/BoardView";
import RulesView from "./components/RulesView";
import RulesPanel from "./components/RulesPanel";

// This is the main component for the entire application.
// It manages the game state, handles user interactions, and renders all other components.
export default function App() {
    // STATE MANAGEMENT
    // Core game logic and board state.
    const [game, setGame] = useState(() => new Game());
    // Tracks the scores for X, O, and ties.
    const [scores, setScores] = useState({ X: 0, O: 0, Ties: 0 });
    // A flag to indicate when the AI is calculating its next move.
    const [isThinking, setIsThinking] = useState(false);
    // Toggles the visibility of the rules panel.
    const [rulesOpen, setRulesOpen] = useState(false);

    // A reference to store the previous game state
    // Useful for detecting when a game has just ended inside a useEffect hook.
    const prevGameRef = useRef(game);

    // DERIVED STATE
    // These values are derived based on the current game state.
    const winner: Cell = game.winner;
    const over: boolean = game.isOver;

    // Determine the status message based on the current game state.
    let status: string;
    if (isThinking) {
        status = "AI is Thinking...";
    } else if (winner) {
        status = `Winner: ${winner}`;
    } else if (over) {
        status = "Draw";
    } else {
        status = `${game.turn}'s Turn`;
    }

    // SIDE EFFECTS
    // This effect runs after the game state changes to update the score.
    useEffect(() => {
        // Only update the score when the game just finished.
        if (!prevGameRef.current.isOver && game.isOver) {
            const w: Cell = game.winner;
            setScores((prevScores) => {
                if (w === "X") {
                    return { ...prevScores, X: prevScores.X + 1 };
                } else if (w === "O") {
                    return { ...prevScores, O: prevScores.O + 1 };
                } else {
                    return { ...prevScores, Ties: prevScores.Ties + 1 };
                }
            });
        }
        // Update the reference to the current game state for the next render.
        prevGameRef.current = game;
    }, [game]);

    // This effect handles the AI's turn.
    useEffect(() => {
        // Only run if it's O's turn and the game is not over.
        if (!game.isOver && game.turn === "O") {
            setIsThinking(true);
            // Simulate delay for more natural feel.
            const timer = setTimeout(() => {
                setGame((prev: Game) => prev.makeAIMove());
                setIsThinking(false);
            }, 500);

            // Cleanup: if the component re-renders before the timer finishes, cancel pending AI move.
            return () => clearTimeout(timer);
        }
    }, [game]);

    // EVENT HANDLERS
    // This function is called when player clicks on a cell.
    function handleCellClick(i: number): void {
        // We update the game state by calling the immutable 'makeMove' method.
        setGame((prev: Game) => prev.makeMove(i));
    }

    // This function resets the game to a new round.
    function handleReset(): void {
        setGame((g: Game) => g.reset());
    }

    // This function will open the rules panel.
    function displayRuleAlert(): void {
        setRulesOpen(true);
    }

    // RENDERING
    return (
        <div className="min-h-screen flex flex-col text-[#F8FAFC]">
            <RulesPanel open={rulesOpen} onClose={() => setRulesOpen(false)}>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base lg:text-lg leading-6">
                    <li>
                        You play as <strong>X</strong> and always goes first.
                    </li>
                    <li>
                        Players take turns placing <strong>X</strong> and{" "}
                        <strong>O</strong> in empty cells.
                    </li>
                    <li>
                        <strong>O</strong> is controlled by an AI using the{" "}
                        <strong>Minimax algorithm</strong> and cannot be beaten.
                    </li>
                    <li>
                        A player wins by getting <strong>3 in a row</strong>{" "}
                        (horizontally, vertically, or diagonally).
                    </li>
                    <li>
                        If all 9 cells are filled with no winner, the game ends
                        in a <strong>draw</strong>.
                    </li>
                    <li>
                        Use the <strong>Reset Board</strong> button to start a
                        new round.
                    </li>
                </ul>
            </RulesPanel>

            <header className="flex justify-between items-center px-4 sm:px-8 mt-4">
                <p className="font-semibold text-[clamp(1.5rem,5vw,4rem)]">
                    Tic Tac Toe
                </p>

                <RulesView rules={displayRuleAlert} />
            </header>

            <main className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center">
                    <div className="font-semibold text-[clamp(1.5rem,4vw,2.5rem)] mb-4">
                        {status}
                    </div>

                    <BoardView
                        cells={game.board.getBoard()}
                        onCellClick={handleCellClick}
                        disabled={over || isThinking}
                    />

                    <div className="mt-6 w-full max-w-lg">
                        <div className="flex justify-center">
                            <button
                                onClick={handleReset}
                                className="select-none rounded p-1 px-2 font-semibold text-xs xs:text-base sm:text-lg md:text-xl text-[#171717] bg-[#F8FAFC]  hover:opacity-65 duration-300 cursor-pointer"
                                disabled={isThinking}
                            >
                                Reset Board
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 w-full max-w-lg">
                        <div className="grid grid-cols-3 gap-4">
                            <ScoreCard label="Player (X)" value={scores.X} />
                            <ScoreCard label="Tie" value={scores.Ties} />
                            <ScoreCard label="AI (O)" value={scores.O} />
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
