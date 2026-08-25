import clsx from "clsx";

export function Cell({
	value,
	row,
	col,
}: {
	value: number | null;
	row: number;
	col: number;
}) {
	return (
		<div
			className={clsx(
				"aspect-square border flex justify-center items-center",
				(row === 2 || row === 5) && "border-b-2",
				(col === 2 || col === 5) && "border-r-2",
				col === 0 && "border-l-0",
				col === 8 && "border-r-0",
				row === 0 && "border-t-0",
				row === 8 && "border-b-0",
			)}
		>
			{value}
		</div>
	);
}
