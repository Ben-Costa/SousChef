const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
export async function apiRequest(path, init) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {})
        },
        ...init
    });
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    return (await response.json());
}
