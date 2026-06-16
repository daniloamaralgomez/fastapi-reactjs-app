import { apiFetch } from "./apiClient";

export function getRandomJoke() {
	return apiFetch("/api/jokes/random");
}
