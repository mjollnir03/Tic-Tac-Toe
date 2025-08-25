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
                    <div className="border-4 border-[#F8FAFC] w-[90vw] max-w-[480px] aspect-square flex items-center justify-center">
                        <p className="opacity-60">Board Placeholder</p>
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

function Board() {}

export default App;
