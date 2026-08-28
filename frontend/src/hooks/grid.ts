import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CellValue, Digit, Grid } from "../types/grid";
import { getGridConflicts, isValidMove } from "../lib/rules";

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
	const [lastMoveError, setLastMoveError] = useState<string | null>(null);

	const conflicts = useMemo(() => getGridConflicts(grid), [grid]);

	const allowInvalidMovesRef = useRef(allowInvalidMoves);
	useEffect(() => {
		allowInvalidMovesRef.current = allowInvalidMoves;
	}, [allowInvalidMoves]);

	const updateCell = useCallback(
		({ rowIndex, colIndex, value }: UpdateCellOptions) => {
			setGrid((grid) => {
				const moveResult = isValidMove(grid, rowIndex, colIndex, value);

				if (!moveResult.valid && moveResult.message) {
					setLastMoveError(moveResult.message);

					if (!allowInvalidMovesRef.current) {
						return grid;
					}
				} else {
					setLastMoveError(null);
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

	return { grid, lastMoveError, conflicts, updateCell, toggleCandidate };
}
