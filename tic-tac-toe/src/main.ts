// Import CSS Styling
import "../node_modules/modern-normalize/modern-normalize.css";
import "./styles/style.css";

const ttt_grid = document.querySelector<HTMLDivElement>("#ttt-grid");

if(ttt_grid){
ttt_grid.querySelectorAll<HTMLDivElement>('div').forEach((cell) => {
    cell.addEventListener("click", () => {
        cell.innerHTML = cell.innerHTML.trim() === "X" ? "O" : "X";
    });
});
}
