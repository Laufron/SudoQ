import type { Cell, CellValue, Digit, Grid } from "../types/grid";

export function createCell(
	value: CellValue = null,
	isInitialValue: boolean = false,
	candidates: Digit[] = [],
): Cell {
	return {
		value,
		isInitialValue,
		candidates,
	};
}

export function createGrid(
	values: CellValue[][],
	allInitialValues: boolean = false,
): Grid {
	return values.map((row) =>
		row.map((value) => createCell(value, value ? allInitialValues : false)),
	);
}

export function parseCellValue(value: string): CellValue | undefined {
	if (value === "") return null;

	if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(value)) {
		return Number(value) as Digit;
	}

	return undefined;
}
