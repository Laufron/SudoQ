import { useCallback, useEffect, useRef } from "react";
import { engineRoot } from "./api/sudoku";
import { CellComponent } from "./components/Cell";
import { useGrid } from "./hooks/grid";
import { createGrid } from "./lib/grid";
import type { CellValue } from "./types/grid";

import "./App.css";

const INITIAL_VALUES: CellValue[][] = [
	[null, 3, null, null, null, null, null, 4, null],
	[5, 4, null, null, 7, 1, null, 2, null],
	[null, null, null, 3, null, null, null, null, 6],
	[null, null, 8, null, null, 9, null, null, null],
	[3, null, 2, null, null, null, null, null, null],
	[null, 1, null, null, null, 7, null, null, 3],
	[null, null, null, null, null, null, null, 8, 9],
	[7, 8, 5, 9, null, null, null, null, null],
	[null, null, null, 5, null, null, null, 6, 2],
];
const INITIAL_GRID = createGrid(INITIAL_VALUES, true);

function App() {
	// Check backend
	useEffect(() => {
		async function checkBackend() {
			const result = await engineRoot();
			console.log(result.message);
		}

		checkBackend();
	}, []);

	const { grid, updateCell, toggleCandidate } = useGrid(INITIAL_GRID);

	const inputRefs = useRef<(HTMLInputElement | null)[][]>(
		Array.from({ length: 9 }, () => Array(9).fill(null)),
	);
	const setInputRef = useCallback(
		(row: number, col: number, element: HTMLInputElement | null) => {
			inputRefs.current[row][col] = element;
		},
		[],
	);
	const focusCell = useCallback((row: number, col: number) => {
		inputRefs.current[row]?.[col]?.focus();
	}, []);

	return (
		<section className="px-8">
			<h1>SudoQ</h1>
			<div className="@container mt-2 grid grid-cols-9 w-full max-w-3xl mx-auto border-8 border-(--outer-border)">
				{grid.map((row, rowIndex) =>
					row.map((cell, colIndex) => (
						<CellComponent
							key={`r${rowIndex}c${colIndex}`}
							row={rowIndex}
							col={colIndex}
							cell={cell}
							updateCell={updateCell}
							toggleCandidate={toggleCandidate}
							focusCell={focusCell}
							setInputRef={setInputRef}
						/>
					)),
				)}
			</div>
		</section>
	);
}

export default App;
