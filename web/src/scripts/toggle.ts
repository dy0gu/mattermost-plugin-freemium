export function toggle(style: HTMLStyleElement): () => void {
	const onKeyDown = (event: KeyboardEvent) => {
		if (
			event.ctrlKey &&
			event.altKey &&
			event.shiftKey &&
			!event.metaKey &&
			!event.repeat &&
			event.code === "KeyF"
		) {
			event.preventDefault();
			style.disabled = !style.disabled;

		}
	};

	document.addEventListener("keydown", onKeyDown);
	return () => document.removeEventListener("keydown", onKeyDown);
}
