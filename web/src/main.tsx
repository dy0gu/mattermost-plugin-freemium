import type { GlobalState } from "@mattermost/types/store";
import type { Action, Store } from "redux";
import manifest from "~/../../plugin.json";
import { fetchConfig } from "~/requests/config";
import type { PluginRegistry } from "~/types/mattermost";
import { injectCSS } from "./utils/css-injector";
import { injectScripts } from "./utils/script-injector";

// https://developers.mattermost.com/integrate/plugins/components/webapp
declare global {
	interface Window {
		registerPlugin(pluginId: string, plugin: Plugin): void;
	}
}

// https://developers.mattermost.com/integrate/reference/webapp/webapp-reference
class Plugin {
	public async initialize(
		registry: PluginRegistry,
		_store: Store<GlobalState, Action<string>>,
	) {
		const config = await fetchConfig();

		injectCSS(config);
		injectScripts(config, registry);
	}

	public uninitialize() {
		// No cleanup needed with current implementation
	}
}

window.registerPlugin(manifest.id, new Plugin());
