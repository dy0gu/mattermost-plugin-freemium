import manifest from "#/plugin.json";

export type PluginConfig = {
	hideEditionBadge: boolean;
	hideHeaderBranding: boolean;
	hideLoginBranding: boolean;
	hideTrialPrompts: boolean;
	hideFooterCopyright: boolean;
	hideSwitcherEditionItem: boolean;
	hideAdminPaidFeatures: boolean;

};

const defaultConfig: PluginConfig = {
	hideEditionBadge: true,
	hideHeaderBranding: false,
	hideLoginBranding: true,
	hideTrialPrompts: true,
	hideFooterCopyright: true,
	hideSwitcherEditionItem: true,
	hideAdminPaidFeatures: false,

};

export async function fetchConfig(): Promise<PluginConfig> {
	try {
		const response = await fetch(`/plugins/${manifest.id}/api/v1/config`, {
			credentials: "same-origin",
		});
		if (!response.ok) {
			return defaultConfig;
		}
		return await response.json();
	} catch {
		return defaultConfig;
	}
}
