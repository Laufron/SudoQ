import { Cell } from "./components/Cell";

import "./App.css";

type Grid = (number | null)[][];

function App() {
	const grid: Grid = [
		[5, 3, null, null, 7, null, null, null, null],
		[6, null, null, 1, 9, 5, null, null, null],
		[null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, 7, null],
		[null, null, null, null, null, null, null, null, null],
	];

	return (
		<>
			<h1>SudoQ</h1>
			<div className="mt-2 grid grid-cols-9 border-4 border-pink-300 aspect-square w-full max-w-lg mx-auto">
				{grid.map((row, rowIndex) =>
					row.map((value, colIndex) => (
						<Cell
							key={`r${rowIndex}c${colIndex}`}
							row={rowIndex}
							col={colIndex}
							value={value}
						/>
					)),
				)}
			</div>
		</>
	);
}

export default App;
