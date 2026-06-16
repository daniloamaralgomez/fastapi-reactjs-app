import { apiFetch } from "./apiClient";

const BASE_URL = "/api/jokes";

export function getSavedJokes() {
	return apiFetch(`${BASE_URL}/saved`);
}

export function saveJoke(joke) {
	return apiFetch(`${BASE_URL}/saved`, {
		method: "POST",

		body: JSON.stringify(joke),
	});
}

export function removeJoke(id) {
	return apiFetch(`${BASE_URL}/saved/${id}`, {
		method: "DELETE",
	});
}
