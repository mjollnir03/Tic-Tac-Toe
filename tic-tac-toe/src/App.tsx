import "./App.css";
import React, { useEffect, useRef, useState } from "react";
// Import the Game class and Cell type from our logic file.
import { Game, type Cell } from "./game";

// This is the main component for the entire application.
export default function App() {
    // === STATE MANAGEMENT ===
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

    // === DERIVED STATE ===
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

    // === SIDE EFFECTS ===
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

    // === EVENT HANDLERS ===
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

    // === JSX (RENDERING) ===
    // This describes the HTML structure of our application.
    return (
        <div className="min-h-screen flex flex-col bg-[#171717] text-[#F8FAFC]">
            {/* Rules panel (shown when rulesOpen == true) */}
            <RulesPanel open={rulesOpen} onClose={() => setRulesOpen(false)}>
                {/* Rules */}
                <ul className="list-disc pl-5 space-y-1 text-[14px] md:text-[16px] lg:text-[20px] leading-6">
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
                <p className="text-[24px] xs:text-[28px] sm:text-[32px] md:text-[48px] lg:text-[64px] font-semibold">
                    Tic Tac Toe
                </p>

                {/* RulesView component rendered here */}
                <RulesView rules={displayRuleAlert} />
            </header>

            {/* Main Game Area */}
            <main className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center">
                    {/* Game Status Display */}
                    <div className="font-semibold text-[24px] xs:text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] mb-4">
                        {status}
                    </div>

                    {/* The BoardView component is rendered here */}
                    <BoardView
                        cells={game.board.getBoard()}
                        onCellClick={handleCellClick}
                        disabled={over || isThinking} // Disable the board while AI is thinking
                    />

                    {/* Game Controls (Reset Button) */}
                    <div className="mt-6 w-full max-w-[520px]">
                        <div className="flex justify-center">
                            <button
                                onClick={handleReset}
                                className="rounded p-1 px-2 font-semibold text-[12px] xs:text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-[#171717] bg-[#F8FAFC]  hover:opacity-65 duration-300 cursor-pointer"
                            >
                                Reset Board
                            </button>
                        </div>
                    </div>

                    {/* Scoreboard Section */}
                    <div className="mt-8 w-full max-w-[520px]">
                        <div className="grid grid-cols-3 gap-4">
                            <ScoreCard label="Player (X)" value={scores.X} />
                            <ScoreCard label="Tie" value={scores.Ties} />
                            <ScoreCard label="AI (O)" value={scores.O} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="text-center py-4 text-[16px] xs:text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold">
                Ellmaer Ranjber
            </footer>
        </div>
    );
}

/* A simple component to display a single score. */
function ScoreCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center px-2 sm:px-4 py-3">
            <div className="text-[16px] xs:text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold">
                {label}
            </div>
            <div className="text-[16px] xs:text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold mt-1">
                {value}
            </div>
        </div>
    );
}

// Defines the "props" (properties) that the BoardView component expects to receive.
type BoardViewProps = {
    cells: ReadonlyArray<Cell>;
    onCellClick: (i: number) => void;
    disabled: boolean;
};

/*
 * A "presentational" component responsible for rendering the 3x3 grid.
 * It receives its data and functions via props from the parent App component.
 */
function BoardView({ cells, onCellClick, disabled }: BoardViewProps) {
    // Base CSS classes for all cells. The main page background color is now applied here.
    const base =
        "flex items-center justify-center select-none cursor-pointer bg-[#171717] " +
        "text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]";

    // The border logic is now handled by the grid container using 'gap' and a background color.
    // This creates perfectly centered grid lines.
    return (
        <div className="grid grid-cols-3 grid-rows-3 w-[280px] h-[280px] xs:w-[360px] xs:h-[360px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] lg:w-[500px] lg:h-[500px] font-semibold bg-[#F8FAFC] gap-[6px] sm:gap-[8px]">
            {cells.map((value, i) => (
                <button
                    key={i} // A unique key for each item in a list, required by React.
                    className={base} // The base classes are applied directly. No more border logic here.
                    onClick={() => onCellClick(i)} // When clicked, call the function passed from App.
                    disabled={disabled || value !== null} // Disable button if game is over or cell is filled.
                    aria-label={`Cell ${i + 1}`}
                >
                    {value}
                </button>
            ))}
        </div>
    );
}

/* A simple presentational component for the "Rules" button. */
function RulesView({ rules }: { rules: () => void }) {
    return (
        <button
            className="text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold underline hover:opacity-65  duration-300 cursor-pointer"
            onClick={rules}
        >
            Rules
        </button>
    );
}

// Defines the props for the RulesPanel component.
type RulesPanelProps = {
    open: boolean; // Controls whether the panel is visible.
    onClose: () => void; // Function to call when the panel should be closed.
    children: React.ReactNode; // The content to display inside the panel.
};

/*
 * A modal dialog component for displaying the rules.
 * It includes a backdrop and can be closed by clicking the backdrop,
 * the close button, or pressing the Escape key.
 */
function RulesPanel({ open, onClose, children }: RulesPanelProps) {
    // This effect adds a keydown event listener to the window.
    // When the "Escape" key is pressed, it calls the onClose function.
    React.useEffect(() => {
        if (!open) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKeyDown);
        // The "cleanup" function removes the event listener when the component unmounts
        // or when the 'open' or 'onClose' dependencies change.
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    // This effect prevents the body from scrolling when the modal is open.
    React.useEffect(() => {
        if (!open) return;
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        // The "cleanup" function restores the original overflow style.
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [open]);

    // Main container for the modal and backdrop.
    // The visibility and animations are controlled by the 'open' state.
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300
                        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
            {/* Backdrop: A semi-transparent layer that covers the page.
                Clicking it will trigger the onClose function. */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog: The main content of the panel. */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="rules-title"
                className={`relative w-full max-w-md transform rounded-lg bg-white text-gray-900 shadow-xl transition-all duration-300
                            ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
                <header className="flex items-center justify-between p-4 border-b">
                    <h2
                        id="rules-title"
                        className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold"
                    >
                        Rules
                    </h2>
                    <button onClick={onClose} aria-label="Close rules panel">
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 hover:opacity-50 transform duration-300 cursor-pointer"
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 460.77 460.77"
                            xmlSpace="preserve"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>{" "}
                            </g>
                        </svg>
                    </button>
                </header>
                <div className="p-4 space-y-3">{children}</div>
            </div>
        </div>
    );
}
