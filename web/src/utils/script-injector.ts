import type { PluginConfig } from "~/requests/config";
import boardsTS from "~/scripts/boards";
import type { PluginRegistry } from "~/types/mattermost";

export function injectScripts(config: PluginConfig, registry: PluginRegistry) {
	const scriptConditions: Array<[boolean, () => void]> = [
		[
			config.enableBoardsFixes,
			() => {
				registry.registerGlobalComponent(() => {
					boardsTS();
					return null;
				});
			},
		],
	];

	scriptConditions.forEach(([enabled, inject]) => {
		if (enabled) {
			inject();
		}
	});
}
