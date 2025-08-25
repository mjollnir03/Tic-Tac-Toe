import "./App.css";

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-[#171717] text-[#F8FAFC]">
            {/* Header */}
            <header className="flex justify-between items-center px-8 mt-4">
                <p className="lg:text-[64px] font-semibold">Tic Tac Toe</p>
                <p className="lg:text-[24px] font-semibold underline cursor-pointer">
                    Rules
                </p>
            </header>

            {/* Game Container */}
            <main className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center">
                    {/* Current Turn */}
                    <div className="font-semibold text-xl lg:text-2xl mb-6">
                        X&apos;s Turn
                    </div>

                    {/* Board */}
                    < Board />

                    {/* Scoreboard  */}
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
            <footer className="text-center py-4 lg:text-[24px] font-semibold">
                Ellmaer Ranjber
            </footer>
        </div>
    );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center px-4 py-3">
            <div className="text-sm lg:text-base font-semibold">{label}</div>
            <div className="text-lg lg:text-xl font-semibold mt-1">{value}</div>
        </div>
    );
}

function Board() {
    return (
        <div className="grid grid-cols-3 grid-rows-3 w-[480px] h-[480px] font-semibold">
            {/* Row 1 */}
            <div className="flex items-center justify-center border-r-[8px] border-b-[8px] border-white text-[96px] text-[#4ADE80]">
                X
            </div>
            <div className="flex items-center justify-center border-r-[8px] border-b-[8px] border-white text-[96px]">
                O
            </div>
            <div className="flex items-center justify-center border-b-[8px] border-white text-[96px]">
                O
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-center border-r-[8px] border-b-[8px] border-white text-[96px]">
                O
            </div>
            <div className="flex items-center justify-center border-r-[8px] border-b-[8px] border-white text-[96px] text-[#4ADE80]">
                X
            </div>
            <div className="flex items-center justify-center border-b-[8px] border-white text-[96px]">
                O
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-center border-r-[8px] border-white text-[96px]">
                O
            </div>
            <div className="flex items-center justify-center border-r-[8px] border-white text-[96px]">
                O
            </div>
            <div className="flex items-center justify-center text-[96px] text-[#4ADE80]">
                X
            </div>
        </div>
    );
}

export default App;
