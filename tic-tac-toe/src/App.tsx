import "./App.css";

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-[#171717] text-[#F8FAFC]">
            {/* Header */}
            <header className="flex justify-between items-center px-4 sm:px-8 mt-4">
                <p className="text-[24px] xs:text-[28px] sm:text-[32px] md:text-[48px] lg:text-[64px] font-semibold">
                    Tic Tac Toe
                </p>
                <p className="text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-semibold underline cursor-pointer">
                    Rules
                </p>
            </header>

            {/* Game Container */}
            <main className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center">
                    {/* Current Turn */}
                    <div className="font-semibold text-[24px] xs:text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] mb-6">
                        X&apos;s Turn
                    </div>

                    {/* Board */}
                    <Board />

                    {/* Scoreboard */}
                    <div className="mt-8 w-full max-w-[520px]">
                        <div className="grid grid-cols-3 gap-4">
                            <ScoreCard label="Player (X)" value={0} />
                            <ScoreCard label="Tie" value={0} />
                            <ScoreCard label="AI (O)" value={0} />
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

function Board() {
    return (
        // Resize grid per breakpoint
        <div className="grid grid-cols-3 grid-rows-3 w-[280px] h-[280px] xs:w-[360px] xs:h-[360px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] lg:w-[500px] lg:h-[500px] font-semibold">
            {/* Row 1 */}
            <div className="flex items-center justify-center border-r-[6px] sm:border-r-[8px] border-b-[6px] sm:border-b-[8px] border-white text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px] text-[#4ADE80]">
                X
            </div>
            <div className="flex items-center justify-center border-r-[6px] sm:border-r-[8px] border-b-[6px] sm:border-b-[8px] border-white text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]">
                O
            </div>
            <div className="flex items-center justify-center border-b-[6px] sm:border-b-[8px] border-white text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]">
                O
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-center border-r-[6px] sm:border-r-[8px] border-b-[6px] sm:border-b-[8px] border-white text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]">
                O
            </div>
            <div className="flex items-center justify-center border-r-[6px] sm:border-r-[8px] border-b-[6px] sm:border-b-[8px] border-white text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px] text-[#4ADE80]">
                X
            </div>
            <div className="flex items-center justify-center border-b-[6px] sm:border-b-[8px] border-white text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]">
                O
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-center border-r-[6px] sm:border-r-[8px] border-white text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]">
                O
            </div>
            <div className="flex items-center justify-center border-r-[6px] sm:border-r-[8px] border-white text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px]">
                O
            </div>
            <div className="flex items-center justify-center text-[48px] xs:text-[60px] sm:text-[72px] md:text-[84px] lg:text-[96px] text-[#4ADE80]">
                X
            </div>
        </div>
    );
}

export default App;
