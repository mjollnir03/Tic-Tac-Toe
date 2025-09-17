import "./styles/App.css";
import { useEffect, useRef, useState } from "react";
import {type Cell } from "./game/board";
import {Game} from "./game/game"
import ScoreCard from "./components/ScoreCard";
import BoardView from "./components/BoardView";
import RulesView from "./components/RulesView";
import RulesPanel from "./components/RulesPanel";


// This is the main component for the entire application.
export default function App() {
    // STATE MANAGEMENT
    // 'game' holds the current instance of our Game class.
    const [game, setGame] = useState(() => new Game());
    // 'scores' holds the scoreboard state.
    const [scores, setScores] = useState({ X: 0, O: 0, Ties: 0 });
    // New state to track when the AI is "thinking".
    const [isThinking, setIsThinking] = useState(false);
    // Panel open state for the Rules sheet
    const [rulesOpen, setRulesOpen] = useState(false);

    // 'useRef' is used to store a value that persists across renders without causing a re-render.
    // We use it to keep track of the previous game state to compare inside useEffect.
    const prevGameRef = useRef(game);

    // DERIVED STATE
    // These are values calculated from our main 'game' state on every render.
    const winner: Cell = game.winner;
    const over: boolean = game.isOver;

    // The status message to be displayed.
    let status: string;
    if (isThinking) {
        // If the AI is thinking, display this message first.
        status = "AI is Thinking...";
    } else if (winner) {
        status = `Winner: ${winner}`;
    } else if (over) {
        status = "Draw";
    } else {
        status = `${game.turn}'s Turn`;
    }

    // SIDE EFFECTS 
    // This useEffect updates the score after the game state has changed.
    useEffect(() => {
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
        prevGameRef.current = game;
    }, [game]);

    // This effect handles the AI's turn with a delay.
    useEffect(() => {
        // If it's O's turn and the game isn't over...
        if (!game.isOver && game.turn === "O") {
            // Set the thinking status to true to update the UI.
            setIsThinking(true);
            // Set a timer to simulate the AI thinking.
            const timer = setTimeout(() => {
                setGame((prev: Game) => prev.makeAIMove());
                // After the move is made, set thinking status back to false.
                setIsThinking(false);
            }, 500); // 500ms = .5 second delay

            // Cleanup function: If the game state changes before the timer finishes
            // (e.g., user resets the board), clear the timer to prevent bugs.
            return () => clearTimeout(timer);
        }
    }, [game]);

    // EVENT HANDLERS
    // This function is called when a cell button is clicked.
    function handleCellClick(i: number): void {
        // We update the game state by calling the immutable 'makeMove' method.
        setGame((prev: Game) => prev.makeMove(i));
    }

    // This function resets the game to its initial state.
    function handleReset(): void {
        setGame((g: Game) => g.reset());
    }

    // This function will call to display Rules Panel
    function displayRuleAlert(): void {
        setRulesOpen(true);
    }

    // JSX (RENDERING)
    // This describes the HTML structure of our application.
    return (
        <div className="min-h-screen flex flex-col bg-[#171717] text-[#F8FAFC]">
            {/* Rules panel (shown when rulesOpen == true) */}
            <RulesPanel open={rulesOpen} onClose={() => setRulesOpen(false)}>
                {/* Rules */}
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base lg:text-lg leading-6">
                    <li>You play as <strong>X</strong> and always goes first.</li>
                    <li>Players take turns placing <strong>X</strong> and <strong>O</strong> in empty cells.</li>
                    <li><strong>O</strong> is controlled by an AI using the <strong>Minimax algorithm</strong> and cannot be beaten.</li>
                    <li>A player wins by getting <strong>3 in a row</strong> (horizontally, vertically, or diagonally).</li>
                    <li>If all 9 cells are filled with no winner, the game ends in a <strong>draw</strong>.</li>
                    <li>Use the <strong>Reset Board</strong> button to start a new round.</li>
                </ul>
            </RulesPanel>

            {/* Header Section */}
            <header className="flex justify-between items-center px-4 sm:px-8 mt-4">
                <p className="font-semibold text-[clamp(1.5rem,5vw,4rem)]">
                    Tic Tac Toe
                </p>

                {/* RulesView component rendered here */}
                <RulesView rules={displayRuleAlert} />
            </header>

            {/* Main Game Area */}
            <main className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center">
                    {/* Game Status Display */}
                    <div className="font-semibold text-[clamp(1.5rem,4vw,2.5rem)] mb-4">
                        {status}
                    </div>

                    {/* The BoardView component is rendered here */}
                    <BoardView
                        cells={game.board.getBoard()}
                        onCellClick={handleCellClick}
                        disabled={over || isThinking} // Disable the board while AI is thinking or while game is over
                    />

                    {/* Game Controls (Reset Button) */}
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

                    {/* Scoreboard Section */}
                    <div className="mt-8 w-full max-w-lg">
                        <div className="grid grid-cols-3 gap-4">
                            <ScoreCard label="Player (X)" value={scores.X} />
                            <ScoreCard label="Tie" value={scores.Ties} />
                            <ScoreCard label="AI (O)" value={scores.O} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="text-center py-4 text-base xs:text-lg sm:text-xl md:text-2xl font-semibold">
                Ellmaer Ranjber
            </footer>
        </div>
    );
}
