import { PluginConfig } from "~/requests/config";
import { PluginRegistry } from "~/types/mattermost";
import boardsTS from "~/scripts/boards";

export function injectScripts(config: PluginConfig, registry: PluginRegistry) {
    const scriptConditions: Array<[boolean, () => void]> = [
        [config.enableBoardsFixes, () => {
            registry.registerGlobalComponent(() => {
                boardsTS();
                return null;
            });
        }],
    ];

    scriptConditions.forEach(([enabled, inject]) => {
        if (enabled) {
            inject();
        }
    });
}
