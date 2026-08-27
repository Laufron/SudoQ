import { useCallback, useEffect, useRef, useState } from "react";
import type { CellValue, Digit, Grid } from "../types/grid";
import { isValidMove } from "../lib/rules";
import type { MoveError } from "../types/rules";

export type UpdateCellOptions = {
	rowIndex: number;
	colIndex: number;
	value: CellValue;
};

export type ToggleCandidateOptions = {
	rowIndex: number;
	colIndex: number;
	candidate: Digit;
};

export function useGrid(initialGrid: Grid, allowInvalidMoves: boolean) {
	const [grid, setGrid] = useState<Grid>(initialGrid);
	const [moveError, setMoveError] = useState<MoveError | null>(null);

	const allowInvalidMovesRef = useRef(allowInvalidMoves);
	useEffect(() => {
		allowInvalidMovesRef.current = allowInvalidMoves;
	}, [allowInvalidMoves]);

	const updateCell = useCallback(
		({ rowIndex, colIndex, value }: UpdateCellOptions) => {
			setGrid((grid) => {
				const moveResult = isValidMove(grid, rowIndex, colIndex, value);

				if (!moveResult.valid && moveResult.error) {
					setMoveError(moveResult.error);

					if (!allowInvalidMovesRef.current) {
						return grid;
					}
				} else {
					setMoveError(null);
				}

				const newGrid = [...grid];
				const newRow = [...newGrid[rowIndex]];
				newRow[colIndex] = { ...newRow[colIndex], value: value };
				newGrid[rowIndex] = newRow;

				return newGrid;
			});
		},
		[],
	);

	const toggleCandidate = useCallback(
		({ rowIndex, colIndex, candidate }: ToggleCandidateOptions) => {
			setGrid((grid) => {
				const newGrid = [...grid];
				const newRow = [...newGrid[rowIndex]];
				const newCell = {
					...newRow[colIndex],
					candidates: [...newRow[colIndex].candidates],
				};
				if (newCell.candidates.includes(candidate)) {
					const index = newCell.candidates.indexOf(candidate, 0);
					if (index > -1) {
						newCell.candidates.splice(index, 1);
					}
				} else {
					newCell.candidates.push(candidate);
				}
				newRow[colIndex] = newCell;
				newGrid[rowIndex] = newRow;
				return newGrid;
			});
		},
		[],
	);

	return { grid, moveError, updateCell, toggleCandidate };
}
