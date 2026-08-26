export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CellValue = Digit | null;

export type Cell = {
	value: CellValue;
	isInitialValue: boolean;
	candidates: Digit[];
};

export type Grid = Cell[][];
