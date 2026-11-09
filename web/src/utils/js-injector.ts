import { toggle } from "~/scripts/toggle";

export function injectJS(style: HTMLStyleElement): { cleanup: () => void } {
	return { cleanup: toggle(style) };
}
