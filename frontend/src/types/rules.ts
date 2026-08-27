import type { CellPosition } from "./grid";

export type MoveError = {
	message: string;
	cells: CellPosition[];
};

export type MoveResult = {
	valid: boolean;
	error?: MoveError;
};
