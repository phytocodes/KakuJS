export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
	let timeoutId: number | undefined;
	return (...args: Parameters<T>) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => func(...args), delay);
	};
}
