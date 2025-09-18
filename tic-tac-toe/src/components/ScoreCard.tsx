// A simple presentational component to display a label and a value, used for the scoreboard.
export default function ScoreCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center px-2 sm:px-4 py-3">
            <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold">
                {label}
            </div>
            <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mt-1">
                {value}
            </div>
        </div>
    );
}