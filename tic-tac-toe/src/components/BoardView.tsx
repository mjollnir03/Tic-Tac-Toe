import type { Cell } from "../game/board";

// Defines the props that the BoardView component accepts.
type BoardViewProps = {
    cells: ReadonlyArray<Cell>; // The 9 cells of the board.
    onCellClick: (i: number) => void; // Function to call when a cell is clicked.
    disabled: boolean; // Disables the board buttons when true.
};

// A presentational component responsible for rendering the 3x3 game board grid.
export default function BoardView({
    cells,
    onCellClick,
    disabled,
}: BoardViewProps) {
    const baseCellStyles =
        "flex items-center justify-center select-none cursor-pointer text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl select-none ";

    // A helper function to add border classes to each cell.
    function cellBorders(i: number): string {
        const borderRight = " border-r-[3px] sm:border-r-[4px]";
        const borderBottom = " border-b-[3px] sm:border-b-[4px]";
        const borderLeft = " border-l-[3px] sm:border-l-[4px]";
        const borderTop = " border-t-[3px] sm:border-t-[4px]";
        let baseClasses = "border-[#F8FAFC]";

        switch (i) {
            // Top Row
            case 0:
                baseClasses += borderRight + borderBottom;
                break;
            case 1:
                baseClasses += borderRight + borderBottom + borderLeft;
                break;
            case 2:
                baseClasses += borderBottom + borderLeft;
                break;

            // Middle Row
            case 3:
                baseClasses += borderTop + borderRight + borderBottom;
                break;
            case 4:
                baseClasses +=
                    borderTop + borderRight + borderBottom + borderLeft;
                break;
            case 5:
                baseClasses += borderTop + borderBottom + borderLeft;
                break;

            // Bottom Row
            case 6:
                baseClasses += borderTop + borderRight;
                break;
            case 7:
                baseClasses += borderTop + borderRight + borderLeft;
                break;
            case 8:
                baseClasses += borderTop + borderLeft;
                break;

            default:
                break;
        }

        return baseClasses;
    }

    return (
        <div className="grid grid-cols-3 grid-rows-3 w-72 h-72 xs:w-80 xs:h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] font-semibold">
            {cells.map((value, i) => (
                <button
                    key={i} // A unique key for each item in a list, required by React.
                    className={`${baseCellStyles} ${cellBorders(i)}`}
                    onClick={() => onCellClick(i)}
                    // A cell is disabled if the game is over or the cell is not empty.
                    disabled={disabled || value !== null}
                    aria-label={`Cell ${i + 1}`}
                >
                    {value}
                </button>
            ))}
        </div>
    );
}
