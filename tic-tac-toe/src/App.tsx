import "./App.css";
import React, { useEffect, useRef } from "react";
// Import the Game class and Cell type from our logic file.
import { Game, type Cell } from "./game";

// This is the main component for the entire application.
export default function App() {
    // === STATE MANAGEMENT ===
    // 'useState' holds the state of our component.
    // 'game' holds the current instance of our Game class.
    // We pass a function () => new Game() so the object is created only once on initial render.
    const [game, setGame] = React.useState(() => new Game());
    // 'scores' holds the scoreboard state.
    const [scores, setScores] = React.useState({ X: 0, O: 0, Ties: 0 });
    // Panel open state for the Rules sheet
    const [rulesOpen, setRulesOpen] = React.useState(false);

    // 'useRef' is used to store a value that persists across renders without causing a re-render.
    // We use it to keep track of the previous game state to compare inside useEffect.
    const prevGameRef = useRef(game);

    // === DERIVED STATE ===
    // These are values calculated from our main 'game' state on every render.
    // We don't need to store them in useState because they depend directly on 'game'.
    const winner: Cell = game.winner;
    const over: boolean = game.isOver;

    // The status message to be displayed (e.g., "X's Turn", "Winner: O").
    let status: string;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (over) {
        status = "Draw";
    } else {
        status = `${game.turn}'s Turn`;
    }

    // === SIDE EFFECTS ===
    // 'useEffect' runs code in response to changes. This is for "side effects".
    // Here, we use it to update the score after the game state has changed.
    useEffect(() => {
        // This condition checks if the game just finished on this render.
        if (!prevGameRef.current.isOver && game.isOver) {
            const w: Cell = game.winner;
            // We use the function form of setScores to ensure we have the latest scores.
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
        // After the effect runs, we update the ref to the current game state.
        prevGameRef.current = game;
    }, [game]); // The dependency array: this effect runs ONLY when the 'game' object changes.

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

    function displayRuleAlert(): void {
        setRulesOpen(true);
    }

    // === JSX (RENDERING) ===
    // This describes the HTML structure of our application.
    return (
        <div className="min-h-screen flex flex-col bg-[#171717] text-[#F8FAFC]">
            
            {/* Rules panel (shown when rulesOpen == true) */}
            <RulesPanel open={rulesOpen} onClose={() => setRulesOpen(false)}>
                {/* example content */}
                <h2 id="rules-title" className="text-xl font-semibold mb-3">
                    Game Rules
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-sm leading-6">
                    <li>Players take turns placing X and O.</li>
                    <li>3 in a row (row/column/diagonal) wins.</li>
                    <li>Full board with no winner -- draw.</li>
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
                        disabled={over}
                    />

                    {/* Game Controls (Reset Button) */}
                    <div className="mt-6 w-full max-w-[520px]">
                        <div className="flex justify-center">
                            <button
                                onClick={handleReset}
                                className="rounded-lg font-semibold text-[12px] xs:text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px]"
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
    // Base CSS classes for all cells.
    const base =
        "flex items-center justify-center select-none " +
        "text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]";

    // A helper function to dynamically add border classes to each cell.
    function cellBorders(i: number): string {
        let classes = "border-white";
        if (i % 3 !== 2) classes += " border-r-[6px] sm:border-r-[8px]"; // Add right border unless it's the last column.
        if (i < 6) classes += " border-b-[6px] sm:border-b-[8px]"; // Add bottom border unless it's the last row.
        return classes;
    }

    return (
        <div className="grid grid-cols-3 grid-rows-3 w-[280px] h-[280px] xs:w-[360px] xs:h-[360px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] lg:w-[500px] lg:h-[500px] font-semibold">
            {cells.map((value, i) => (
                <button
                    key={i} // A unique key for each item in a list, required by React.
                    className={`${base}${cellBorders(i)}`}
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

function RulesView({ rules }: { rules: () => void }) {
    return (
        <button
            className="text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold underline"
            onClick={rules}
        >
            Rules
        </button>
    );
}

type RulesPanelProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

function RulesPanel({ open, onClose, children }: RulesPanelProps) {
    // Close on Escape
    React.useEffect(() => {
        if (!open) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    // Prevent scroll bleed on body when open
    React.useEffect(() => {
        if (!open) return;
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [open]);

    // Main container for the modal and backdrop
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300
                        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="rules-title"
                className={`relative w-full max-w-sm transform rounded-lg bg-white text-gray-900 shadow-xl transition-all duration-300
                            ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
                <header className="flex items-center justify-between p-4 border-b">
                    <h2
                        id="rules-title"
                        className="text-lg sm:text-xl font-semibold"
                    >
                        Rules
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-800"
                        onClick={onClose}
                        aria-label="Close rules panel"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </header>
                <div className="p-4 space-y-3">
                    {children}
                </div>
            </div>
        </div>
    );
}
