import { useCallback, useEffect, useRef, useState } from "react";
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
	const [allowInvalidMoves, setAllowInvalidMoves] = useState<boolean>(true);
	const [showInvalidMoves, setShowInvalidMoves] = useState<boolean>(true);

	// Check backend
	useEffect(() => {
		async function checkBackend() {
			const result = await engineRoot();
			console.log(result.message);
		}

		checkBackend();
	}, []);

	const { grid, lastMoveError, conflicts, updateCell, toggleCandidate } =
		useGrid(INITIAL_GRID, allowInvalidMoves);

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

			<div className="mx-auto flex max-w-5xl flex-col items-center gap-2 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
				<div className="@container w-full max-w-2xl">
					<div className="grid w-full grid-cols-9 border-8 border-(--outer-border)">
						{grid.map((row, rowIndex) =>
							row.map((cell, colIndex) => (
								<CellComponent
									key={`r${rowIndex}c${colIndex}`}
									row={rowIndex}
									col={colIndex}
									cell={cell}
									isConflicting={
										(showInvalidMoves &&
											conflicts.some(
												(cell) =>
													cell.rowIndex === rowIndex &&
													cell.colIndex === colIndex,
											)) ??
										false
									}
									updateCell={updateCell}
									toggleCandidate={toggleCandidate}
									focusCell={focusCell}
									setInputRef={setInputRef}
								/>
							)),
						)}
					</div>
					{lastMoveError && showInvalidMoves && (
						<p className="text-red-700">{lastMoveError}</p>
					)}
				</div>
				<aside className="w-full max-w-56 border-(--border) pt-8">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="validation-mode"
								className="text-sm text-(--text-h) font-semibold"
							>
								Validation
							</label>

							<select
								id="validation-mode"
								className="w-full border-b border-(--border) bg-transparent py-1.5 text-sm text-(--text) outline-none focus:border-(--accent)"
								value={
									!allowInvalidMoves
										? "strict"
										: showInvalidMoves
											? "assist"
											: "free"
								}
								onChange={(e) => {
									switch (e.target.value) {
										case "strict":
											setAllowInvalidMoves(false);
											setShowInvalidMoves(true);
											break;

										case "assist":
											setAllowInvalidMoves(true);
											setShowInvalidMoves(true);
											break;

										case "free":
											setAllowInvalidMoves(true);
											setShowInvalidMoves(false);
											break;
									}
								}}
							>
								<option value="strict">Bloquer les erreurs</option>
								<option value="assist" defaultChecked>
									Signaler les erreurs
								</option>
								<option value="free">Aucune aide</option>
							</select>
						</div>

						{/* <div className="flex flex-col gap-1.5">
							<label htmlFor="difficulty" className="text-sm text-(--text-h)">
								Difficulté
							</label>

							<select
								id="difficulty"
								className="w-full border-b border-(--border) bg-transparent py-1.5 text-sm text-(--text) outline-none focus:border-(--accent)"
							>
								<option value="easy">Facile</option>
								<option value="medium">Moyen</option>
								<option value="hard">Difficile</option>
							</select>
						</div> */}
					</div>
				</aside>
			</div>
		</section>
	);
}

export default App;
