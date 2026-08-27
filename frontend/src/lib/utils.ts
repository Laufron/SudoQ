export function HasDuplicates(arr: number[]): boolean {
	const uniques = new Set(arr);
	return uniques.size !== arr.length;
}

export function GetDuplicates(arr: number[]): number[] {
	const seen = new Set<number>();
	const duplicates = new Set<number>();
	for (const value of arr) {
		if (seen.has(value)) {
			duplicates.add(value);
		} else {
			seen.add(value);
		}
	}
	return [...duplicates];
}
