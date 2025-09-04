import "./App.css";
import React, { useEffect, useRef } from "react";
import { Game, type Cell } from "./game";

export default function App() {
    const [game, setGame] = React.useState(() => new Game());
    const [scores, setScores] = React.useState({ X: 0, O: 0, Ties: 0 });
    const prevGameRef = useRef(game);

    const winner = game.winner;
    const over = game.isOver;

    let status;

    if (winner) {
        status = `Winner: ${winner}`;
    } else if (over) {
        status = "Draw";
    } else {
        status = `${game.turn}'s Turn`;
    }

    function handleCellClick(i: number) {
        setGame((prev) => prev.makeMove(i));
    }

    useEffect(() => {
        // Check if the game wasn't over before, but IS over now
        if (!prevGameRef.current.isOver && game.isOver) {
            const w = game.winner;
            setScores((prevScores) => {
                if (w === "X") {
                    return { ...prevScores, X: prevScores.X + 1 };
                } else if (w === "O") {
                    return { ...prevScores, O: prevScores.O + 1 };
                } else {
                    // This handles a tie, where 'w' is null
                    return { ...prevScores, Ties: prevScores.Ties + 1 };
                }
            });
        }
        // Update the ref to the current game state for the next render
        prevGameRef.current = game;
    }, [game]);

    function handleReset() {
        setGame((g) => g.reset());
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#171717] text-[#F8FAFC]">
            {/* Header */}
            <header className="flex justify-between items-center px-4 sm:px-8 mt-4">
                <p className="text-[24px] xs:text-[28px] sm:text-[32px] md:text-[48px] lg:text-[64px] font-semibold">
                    Tic Tac Toe
                </p>
                <button className="text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold underline">
                    Rules
                </button>
            </header>

            {/* Game Container */}
            <main className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center">
                    {/* Status */}
                    <div className="font-semibold text-[24px] xs:text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] mb-4">
                        {status}
                    </div>

                    {/* Board */}
                    <BoardView
                        cells={game.board.getBoard()}
                        onCellClick={handleCellClick}
                        disabled={over}
                    />

                    {/* Controls */}
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

                    {/* Scoreboard */}
                    <div className="mt-8 w-full max-w-[520px]">
                        <div className="grid grid-cols-3 gap-4">
                            <ScoreCard label="Player (X)" value={scores.X} />
                            <ScoreCard label="Tie" value={scores.Ties} />
                            <ScoreCard label="AI (O)" value={scores.O} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-4 text-[16px] xs:text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold">
                Ellmaer Ranjber
            </footer>
        </div>
    );
}

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

type BoardViewProps = {
    cells: ReadonlyArray<Cell>;
    onCellClick: (i: number) => void;
    disabled: boolean;
};

function BoardView({ cells, onCellClick, disabled }: BoardViewProps) {
    const base =
        "flex items-center justify-center select-none " +
        "text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]";

    function cellBorders(i: number): string {
        let classes = " border-white";
        if (i % 3 !== 2) classes += " border-r-[6px] sm:border-r-[8px]";
        if (i < 6) classes += " border-b-[6px] sm:border-b-[8px]";
        return classes;
    }

    return (
        <div className="grid grid-cols-3 grid-rows-3 w-[280px] h-[280px] xs:w-[360px] xs:h-[360px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] lg:w-[500px] lg:h-[500px] font-semibold">
            {cells.map((value, i) => (
                <button
                    key={i}
                    className={`${base}${cellBorders(i)}`}
                    onClick={() => onCellClick(i)}
                    disabled={disabled || value !== null}
                    aria-label={`Cell ${i + 1}`}
                >
                    {value}
                </button>
            ))}
        </div>
    );
}
