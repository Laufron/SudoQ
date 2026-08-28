import type {
	Cell,
	CellPosition,
	CellValue,
	Digit,
	Grid,
	PositionedCell,
} from "../types/grid";
import type { MoveResult } from "../types/rules";

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

// Not used yet

// function isValidGridShape(grid: Grid): boolean {
// 	return grid.length === 9 && grid.every((row) => row.length === 9);
// }

// function isGroupValid(group: Cell[]): boolean {
// 	return !HasDuplicates(
// 		group.map((cell) => cell.value).filter((value) => value !== null),
// 	);
// }

// function isGridValid(grid: Grid): boolean {
// 	for (let index = 0; index < grid.length; index++) {
// 		if (!isGroupValid(getRow(grid, index).map((pCell) => pCell.cell)))
// 			return false;
// 		if (!isGroupValid(getCol(grid, index).map((pCell) => pCell.cell)))
// 			return false;
// 	}

// 	for (let rowIndex = 0; rowIndex < grid.length; rowIndex += 3) {
// 		for (let colIndex = 0; colIndex < grid.length; colIndex += 3) {
// 			if (
// 				!isGroupValid(
// 					getBlock(grid, rowIndex, colIndex).map((pCell) => pCell.cell),
// 				)
// 			)
// 				return false;
// 		}
// 	}
// 	return true;
// }

export function isValidMove(
	grid: Grid,
	rowIndex: number,
	colIndex: number,
	value: CellValue,
): MoveResult {
	if (value === null) return { valid: true };

	const groups = [
		{
			group: getBlock(grid, rowIndex, colIndex),
			message: "Bloc invalide" as const,
		},
		{ group: getRow(grid, rowIndex), message: "Ligne invalide" as const },
		{ group: getCol(grid, colIndex), message: "Colonne invalide" as const },
	];

	function canInsertValueInGroup(group: Cell[], value: CellValue): boolean {
		if (value === null) return true;

		return !group.some((cell) => cell.value === value);
	}

	for (const { group, message } of groups) {
		const validMove = canInsertValueInGroup(
			group.map((pCell) => pCell.cell),
			value,
		);

		if (!validMove) return { valid: false, message };
	}

	return { valid: true };
}

function getGroupConflicts(group: PositionedCell[]): PositionedCell[] {
	const values = new Map<Digit, PositionedCell[]>();

	for (const pCell of group) {
		if (pCell.cell.value === null) continue;

		const cells = values.get(pCell.cell.value) ?? [];
		cells.push(pCell);
		values.set(pCell.cell.value, cells);
	}

	return [...values.values()].filter((cells) => cells.length > 1).flat();
}

export function getGridConflicts(grid: Grid): CellPosition[] {
	const conflicts = new Set<CellPosition>([]);

	const addConflicts = (group: PositionedCell[]) => {
		for (const { rowIndex, colIndex } of getGroupConflicts(group)) {
			conflicts.add({ rowIndex, colIndex });
		}
	};

	for (let index = 0; index < grid.length; index++) {
		addConflicts(getRow(grid, index));
		addConflicts(getCol(grid, index));
	}

	for (let rowIndex = 0; rowIndex < grid.length; rowIndex += 3) {
		for (let colIndex = 0; colIndex < grid.length; colIndex += 3) {
			addConflicts(getBlock(grid, rowIndex, colIndex));
		}
	}

	return [...conflicts];
}
