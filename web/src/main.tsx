import type { GlobalState } from "@mattermost/types/store";
import type { Action, Store } from "redux";
import manifest from "~/../../plugin.json";
import type { PluginRegistry } from "~/types/mattermost";
import { fetchConfig } from "~/requests/config";
import { injectCSS } from "./utils/css-injector";
import { injectScripts } from "./utils/script-injector";

interface PluginConfig {
	hide_edition_badge: boolean;
	hide_header_branding: boolean;
	hide_login_branding: boolean;
	hide_trial_prompts: boolean;
	hide_footer_copyright: boolean;
	hide_paid_features: boolean;
	enable_boards_fixes: boolean;
}

const defaultConfig: PluginConfig = {
	hide_edition_badge: true,
	hide_header_branding: true,
	hide_login_branding: true,
	hide_trial_prompts: true,
	hide_footer_copyright: true,
	hide_paid_features: true,
	enable_boards_fixes: true,
};

// https://developers.mattermost.com/integrate/plugins/components/webapp
declare global {
	interface Window {
		registerPlugin(pluginId: string, plugin: Plugin): void;
	}
}

async function fetchConfig(): Promise<PluginConfig> {
	try {
		const response = await fetch(
			`/plugins/${manifest.id}/api/v1/config`,
			{ credentials: "same-origin" },
		);
		if (!response.ok) {
			return defaultConfig;
		}
		return await response.json();
	} catch {
		return defaultConfig;
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
