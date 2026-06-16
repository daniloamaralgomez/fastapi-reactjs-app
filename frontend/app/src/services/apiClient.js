import { API_BASE_URL } from "../config/api";

export async function apiFetch(endpoint, options = {}) {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		headers: {
			"Content-Type": "application/json",
		},

		...options,
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status}`);
	}

	// DELETE endpoints sometimes return empty bodies
	if (response.status === 204) {
		return null;
	}

	return response.json();
}
