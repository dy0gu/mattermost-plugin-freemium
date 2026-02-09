import type { GlobalState } from "@mattermost/types/store";
import type { Action, Store } from "redux";
import manifest from "~/../../plugin.json";
import boardsTS from "~/scripts/boards";
import boardsCSS from "~/styles/boards.css?raw";
import editionBadgeCSS from "~/styles/edition-badge.css?raw";
import footerCopyrightCSS from "~/styles/footer-copyright.css?raw";
import headerBrandingCSS from "~/styles/header-branding.css?raw";
import loginBrandingCSS from "~/styles/login-branding.css?raw";
import paidFeaturesCSS from "~/styles/paid-features.css?raw";
import trialPromptsCSS from "~/styles/trial-prompts.css?raw";
import type { PluginRegistry } from "~/types/mattermost";

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

		// CSS INJECTION
		const cssparts: string[] = [];

		// HideHeaderBranding takes precedence over HideEditionBadge
		if (config.hide_header_branding) {
			cssparts.push(headerBrandingCSS);
		} else if (config.hide_edition_badge) {
			cssparts.push(editionBadgeCSS);
		}

		if (config.hide_login_branding) {
			cssparts.push(loginBrandingCSS);
		}

		if (config.hide_trial_prompts) {
			cssparts.push(trialPromptsCSS);
		}

		if (config.hide_footer_copyright) {
			cssparts.push(footerCopyrightCSS);
		}

		if (config.hide_paid_features) {
			cssparts.push(paidFeaturesCSS);
		}

		if (config.enable_boards_fixes) {
			cssparts.push(boardsCSS);
		}

		if (cssparts.length > 0) {
			const style = document.createElement("style");
			style.textContent = cssparts.join("\n");
			document.head.appendChild(style);
		}

		// TS INJECTION
		if (config.enable_boards_fixes) {
			registry.registerGlobalComponent(() => {
				boardsTS();
				return null;
			});
		}
	}

	public uninitialize() {
		// No cleanup needed with current implementation
	}
}

window.registerPlugin(manifest.id, new Plugin());
