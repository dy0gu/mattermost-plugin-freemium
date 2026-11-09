import type { PluginConfig } from "~/requests/config";
import adminPaidFeaturesCSS from "~/styles/admin-paid-features.css?raw";
import editionBadgeCSS from "~/styles/edition-badge.css?raw";
import footerCopyrightCSS from "~/styles/footer-copyright.css?raw";
import headerBrandingCSS from "~/styles/header-branding.css?raw";
import loginBrandingCSS from "~/styles/login-branding.css?raw";
import trialPromptsCSS from "~/styles/trial-prompts.css?raw";
import switcherEditionItemCSS from "~/styles/switcher-edition-item.css?raw";

export function injectCSS(config: PluginConfig) {
	const cssParts: string[] = [];

	const cssConditions: Array<[boolean, string]> = [
		[config.hideHeaderBranding, headerBrandingCSS],
		[config.hideEditionBadge && !config.hideHeaderBranding, editionBadgeCSS],
		[config.hideLoginBranding, loginBrandingCSS],
		[config.hideTrialPrompts, trialPromptsCSS],
		[config.hideFooterCopyright, footerCopyrightCSS],
		[config.hideSwitcherEditionItem, switcherEditionItemCSS],
		[config.hideAdminPaidFeatures, adminPaidFeaturesCSS],
	];

	cssConditions.forEach(([enabled, css]) => {
		if (enabled) {
			cssParts.push(css);
		}
	});

	const style = document.createElement("style");
	style.textContent = cssParts.join("\n");
	document.head.appendChild(style);
	return style;
}
