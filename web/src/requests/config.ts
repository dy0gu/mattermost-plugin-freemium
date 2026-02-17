import manifest from "~/../../plugin.json";

export type PluginConfig = {
	hideEditionBadge: boolean;
	hideHeaderBranding: boolean;
	hideLoginBranding: boolean;
	hideTrialPrompts: boolean;
	hideFooterCopyright: boolean;
	hideUserPaidFeatures: boolean;
	hideAdminPaidFeatures: boolean;
	enableBoardsFixes: boolean;
};

const defaultConfig: PluginConfig = {
	hideEditionBadge: true,
	hideHeaderBranding: true,
	hideLoginBranding: true,
	hideTrialPrompts: true,
	hideFooterCopyright: true,
	hideUserPaidFeatures: true,
	hideAdminPaidFeatures: true,
	enableBoardsFixes: true,
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
