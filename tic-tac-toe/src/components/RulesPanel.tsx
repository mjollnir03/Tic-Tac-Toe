import React from "react";

type RulesPanelProps = {
    open: boolean; // If true, the panel is visible.
    onClose: () => void; // A function to close the panel.
    children: React.ReactNode; // Content to display inside the panel.
};

// A dialog component for displaying the game rules.
// It appears over the main content with a backdrop.
export default function RulesPanel({
    open,
    onClose,
    children,
}: RulesPanelProps) {
    // Effect to handle closing the panel with the "Escape" key.
    React.useEffect(() => {
        if (!open) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKeyDown);
        // Remove event listener on unmount or dependency change.
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    // Effect to prevent the page from scrolling when the panel is open.
    React.useEffect(() => {
        if (!open) return;
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        // TCleanup function to restore original scroll behavior
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [open]);

    // Controls the visibility and animations of the entire modal container.
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300
                        ${
                            open
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                        }`}
        >
            {/* Semi-transparent backdrop that closes when clicked */}
            <div
                className="absolute inset-0 bg-[#171717]/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Main dialog box containing the content */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="rules-title"
                className={`relative w-full max-w-md transform rounded-lg bg-[#F8FAFC] text-[#171717] shadow-xl transition-all duration-300
                            ${
                                open
                                    ? "scale-100 opacity-100"
                                    : "scale-95 opacity-0"
                            }`}
            >
                <header className="flex items-center justify-between p-4 border-b">
                    <h2
                        id="rules-title"
                        className="text-xl md:text-2xl font-semibold"
                    >
                        Rules
                    </h2>
                    <button onClick={onClose} aria-label="Close rules panel">
                        <svg
                            className="select-none w-5 h-5 md:w-6 md:h-6 hover:opacity-50 transform duration-300 cursor-pointer"
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
