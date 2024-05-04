export function formatBytes(
	bytes: number,
	opts: {
		decimals?: number;
		sizeType?: "accurate" | "normal";
	} = {},
) {
	const { decimals = 0, sizeType = "normal" } = opts;

	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(decimals)} ${
		sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
	}`;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface DebouncedFunc<T extends (...args: any[]) => any> {
	/**
	 * Call the original function, but applying the debounce rules.
	 *
	 * If the debounced function can be run immediately, this calls it and returns its return
	 * value.
	 *
	 * Otherwise, it returns the return value of the last invocation, or undefined if the debounced
	 * function was not invoked yet.
	 */
	(...args: Parameters<T>): ReturnType<T> | undefined;

	/**
	 * Throw away any pending invocation of the debounced function.
	 */
	cancel(): void;

	/**
	 * If there is a pending invocation of the debounced function, invoke it immediately and return
	 * its return value.
	 *
	 * Otherwise, return the value from the last invocation, or undefined if the debounced function
	 * was never invoked.
	 */
	flush(): ReturnType<T> | undefined;
}
