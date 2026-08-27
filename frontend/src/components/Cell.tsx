import clsx from "clsx";
import { memo, useCallback } from "react";
import { parseCellValue } from "../lib/grid";
import type { Cell, Digit } from "../types/grid";
import type { ToggleCandidateOptions, UpdateCellOptions } from "../hooks/grid";

type CellProps = {
	cell: Cell;
	row: number;
	col: number;
	isConflicting: boolean;
	updateCell: (options: UpdateCellOptions) => void;
	toggleCandidate: (options: ToggleCandidateOptions) => void;
	focusCell: (row: number, col: number) => void;
	setInputRef: (
		row: number,
		col: number,
		element: HTMLInputElement | null,
	) => void;
};

export const CellComponent = memo(function CellComponent({
	cell,
	row,
	col,
	isConflicting,
	updateCell,
	toggleCandidate,
	focusCell,
	setInputRef,
}: CellProps) {
	const inputRef = useCallback(
		(element: HTMLInputElement | null) => {
			setInputRef(row, col, element);
		},
		[row, col, setInputRef],
	);
	return (
		<div
			className={clsx(
				"relative flex aspect-square items-center justify-center border border-(--border) text-(--text)",
				"has-focus:border-(--accent-border) has-focus:border-4",
				isConflicting && "bg-(--accent)/30",
				(row === 2 || row === 5) && "border-b-4",
				(col === 2 || col === 5) && "border-r-4",
				col === 0 && "border-l-0",
				col === 8 && "border-r-0",
				row === 0 && "border-t-0",
				row === 8 && "border-b-0",
			)}
		>
			{cell.value === null && (
				<div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
					{Array.from({ length: 9 }, (_, i) => i + 1).map((candidate) => (
						<div
							key={candidate}
							className="flex items-center justify-center text-[2cqw]"
						>
							{cell.candidates.includes(candidate as Digit) ? candidate : ""}
						</div>
					))}
				</div>
			)}

			<input
				ref={inputRef}
				type="text"
				value={cell.value ?? ""}
				readOnly={cell.isInitialValue}
				maxLength={1}
				onChange={(e) => {
					const value = parseCellValue(e.target.value);
					if (value !== undefined) {
						updateCell({
							rowIndex: row,
							colIndex: col,
							value: value,
						});
					}
				}}
				className={clsx(
					"w-full h-full border-none outline-none bg-transparent text-center text-[4cqw]",
					cell.isInitialValue && "font-bold",
					isConflicting && "text-(--accent)",
				)}
				onKeyDown={(e) => {
					// Only triggered when input is focused
					if (e.ctrlKey && /^[1-9]$/.test(e.key)) {
						e.preventDefault();
						if (!cell.isInitialValue)
							toggleCandidate({
								rowIndex: row,
								colIndex: col,
								candidate: Number(e.key) as Digit,
							});
					}
					switch (e.key) {
						case "ArrowUp":
							focusCell(row - 1, col);
							break;
						case "ArrowRight":
							focusCell(row, col + 1);
							break;
						case "ArrowDown":
							focusCell(row + 1, col);
							break;
						case "ArrowLeft":
							focusCell(row, col - 1);
							break;
						case "Delete":
							if (!cell.isInitialValue)
								updateCell({ rowIndex: row, colIndex: col, value: null });
							break;
						case "Backspace":
							if (!cell.isInitialValue)
								updateCell({ rowIndex: row, colIndex: col, value: null });
							if (e.ctrlKey && /^[1-9]$/.test(e.key)) {
								// toggle candidate
							}
					}
				}}
			/>
		</div>
	);
});
