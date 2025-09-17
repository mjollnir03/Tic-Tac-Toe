/* A simple presentational component for the "Rules" button. */
export default function RulesView({ rules }: { rules: () => void }) {
    return (
        <button
            className="select-none text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold underline hover:opacity-65  duration-300 cursor-pointer"
            onClick={rules}
        >
            Rules
        </button>
    );
}