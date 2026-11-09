import type { GlobalState } from "@mattermost/types/store";
import type { Action, Store } from "redux";
import manifest from "#/plugin.json";
import { fetchConfig } from "~/requests/config";
import type { PluginRegistry } from "~/types/mattermost";
import { injectCSS } from "./utils/css-injector";
import { injectJS } from "./utils/js-injector";

// https://developers.mattermost.com/integrate/plugins/components/webapp
declare global {
	interface Window {
		registerPlugin(pluginId: string, plugin: Plugin): void;
	}
}

// https://developers.mattermost.com/integrate/reference/webapp/webapp-reference
class Plugin {
	private generation = 0;
	private cleanup?: () => void;

	public async initialize(
		_registry: PluginRegistry,
		_store: Store<GlobalState, Action<string>>,
	) {
		const generation = ++this.generation;
		const config = await fetchConfig();
		if (generation !== this.generation) {
			return;
		}
		const style = injectCSS(config);
		const scripts = injectJS(style);

		this.cleanup = () => {
			scripts.cleanup();
			style.remove();
		};
	}

	public uninitialize() {
		this.generation++;
		this.cleanup?.();
		this.cleanup = undefined;
	}
}

window.registerPlugin(manifest.id, new Plugin());
