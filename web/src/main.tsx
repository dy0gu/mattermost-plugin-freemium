import type { GlobalState } from "@mattermost/types/store";
import type { Action, Store } from "redux";
import manifest from "~/../../plugin.json";
import boardsTS from "~/scripts/boards";
import boardsCSS from "~/styles/boards.css?raw";
import premiumCSS from "~/styles/premium.css?raw";
import type { PluginRegistry } from "~/types/mattermost";

// https://developers.mattermost.com/integrate/plugins/components/webapp
declare global {
	interface Window {
		registerPlugin(pluginId: string, plugin: Plugin): void;
	}
}

// https://developers.mattermost.com/integrate/reference/webapp/webapp-reference
class Plugin {
	public initialize(registry: PluginRegistry, _store: Store<GlobalState, Action<string>>) {
		// CSS INJECTION
		const style = document.createElement("style");
		style.textContent = [
			// Import as raw and join the contents to be added to the DOM, additional styles can be appended here
			premiumCSS,
			boardsCSS,
		].join("\n");
		document.head.appendChild(style);

		// TS INJECTION
		registry.registerGlobalComponent(() => {
			// Call any script that needs to be ran in the app, additional functions can be added here
			boardsTS();

			return null;
		});
	}

	public uninitialize() {
		// No cleanup needed with current implementation
	}
}

window.registerPlugin(manifest.id, new Plugin());
