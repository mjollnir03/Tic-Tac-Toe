// Import CSS Styling
import "../node_modules/modern-normalize/modern-normalize.css";
import "./styles/style.css";

const cells = document.querySelectorAll<HTMLDivElement>(".ttt-grid-cell");

cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        cell.innerHTML = cell.innerHTML.trim() === "X" ? "O" : "X";
    });
});
