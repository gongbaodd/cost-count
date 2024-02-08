export async function hash(password: string) {
	const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
	const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

	return hash;
}
