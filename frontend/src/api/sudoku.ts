import type { EngineRootResponse } from "../types/engine";

const BACKEND_URL = "http://127.0.0.1:8000";

export async function engineRoot(): Promise<EngineRootResponse> {
	const url = new URL("/engine", BACKEND_URL);
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	return (await response.json()) as EngineRootResponse;
}
