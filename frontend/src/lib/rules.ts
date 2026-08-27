import type { Cell, CellValue, Grid, PositionedCell } from "../types/grid";
import { HasDuplicates } from "./utils";
import type { MoveError, MoveResult } from "../types/rules";

export function getRow(grid: Grid, rowIndex: number): PositionedCell[] {
	return grid[rowIndex].map((cell, colIndex) => ({ cell, rowIndex, colIndex }));
}

export function getCol(grid: Grid, colIndex: number): PositionedCell[] {
	return grid.map((row, rowIndex) => ({
		cell: row[colIndex],
		rowIndex,
		colIndex,
	}));
}

export function getBlock(
	grid: Grid,
	rowIndex: number,
	colIndex: number,
): PositionedCell[] {
	const rowBlockStart = 3 * Math.floor(rowIndex / 3);
	const colBlockStart = 3 * Math.floor(colIndex / 3);
	return grid.slice(rowBlockStart, rowBlockStart + 3).flatMap((row, r) =>
		row.slice(colBlockStart, colBlockStart + 3).map((cell, c) => ({
			cell,
			rowIndex: rowBlockStart + r,
			colIndex: colBlockStart + c,
		})),
	);
}

export function isGroupValid(group: Cell[]): boolean {
	return !HasDuplicates(
		group.map((cell) => cell.value).filter((value) => value !== null),
	);
}

export function isValidGridShape(grid: Grid): boolean {
	return grid.length === 9 && grid.every((row) => row.length === 9);
}

export function isGridValid(grid: Grid): boolean {
	for (let index = 0; index < grid.length; index++) {
		if (!isGroupValid(getRow(grid, index).map((pCell) => pCell.cell)))
			return false;
		if (!isGroupValid(getCol(grid, index).map((pCell) => pCell.cell)))
			return false;
	}

	for (let rowIndex = 0; rowIndex < grid.length; rowIndex += 3) {
		for (let colIndex = 0; colIndex < grid.length; colIndex += 3) {
			if (
				!isGroupValid(
					getBlock(grid, rowIndex, colIndex).map((pCell) => pCell.cell),
				)
			)
				return false;
		}
	}
	return true;
}
function getConflictingCells(
	group: PositionedCell[],
	rowIndex: number,
	colIndex: number,
	value: CellValue,
): PositionedCell[] {
	if (value === null) return [];

	return group
		.filter(
			(pCell) => pCell.rowIndex !== rowIndex || pCell.colIndex !== colIndex,
		)
		.filter((pCell) => pCell.cell.value === value);
}

function validateGroup(
	group: PositionedCell[],
	rowIndex: number,
	colIndex: number,
	value: CellValue,
	message: MoveError["message"],
): MoveResult {
	const conflictingCells = getConflictingCells(
		group,
		rowIndex,
		colIndex,
		value,
	);

	if (conflictingCells.length === 0) return { valid: true };

	return {
		valid: false,
		error: {
			message,
			cells: [
				...conflictingCells.map(({ rowIndex, colIndex }) => ({
					rowIndex,
					colIndex,
				})),
				{ rowIndex, colIndex },
			],
		},
	};
}

export function isValidMove(
	grid: Grid,
	rowIndex: number,
	colIndex: number,
	value: CellValue,
): MoveResult {
	if (value === null) return { valid: true };

	const groups = [
		{
			cells: getBlock(grid, rowIndex, colIndex),
			message: "Bloc invalide" as const,
		},
		{ cells: getRow(grid, rowIndex), message: "Ligne invalide" as const },
		{ cells: getCol(grid, colIndex), message: "Colonne invalide" as const },
	];

	for (const { cells, message } of groups) {
		const result = validateGroup(cells, rowIndex, colIndex, value, message);

		if (!result.valid) return result;
	}

	return { valid: true };
}
