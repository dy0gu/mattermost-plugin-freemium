import { PluginConfig } from "~/requests/config";
import boardsCSS from "~/styles/boards.css?raw";
import editionBadgeCSS from "~/styles/edition-badge.css?raw";
import footerCopyrightCSS from "~/styles/footer-copyright.css?raw";
import headerBrandingCSS from "~/styles/header-branding.css?raw";
import loginBrandingCSS from "~/styles/login-branding.css?raw";
import userPaidFeaturesCSS from "~/styles/user-paid-features.css?raw";
import adminPaidFeaturesCSS from "~/styles/admin-paid-features.css?raw";
import trialPromptsCSS from "~/styles/trial-prompts.css?raw";

export function injectCSS(config: PluginConfig) {
    const cssParts: string[] = [];

    const cssConditions: Array<[boolean, string]> = [
        [config.hideHeaderBranding, headerBrandingCSS],
        [config.hideEditionBadge && !config.hideHeaderBranding, editionBadgeCSS],
        [config.hideLoginBranding, loginBrandingCSS],
        [config.hideTrialPrompts, trialPromptsCSS],
        [config.hideFooterCopyright, footerCopyrightCSS],
        [config.hideUserPaidFeatures, userPaidFeaturesCSS],
        [config.hideAdminPaidFeatures, adminPaidFeaturesCSS],
        [config.enableBoardsFixes, boardsCSS],
    ];

    cssConditions.forEach(([enabled, css]) => {
        if (enabled) {
            cssParts.push(css);
        }
    });

    if (cssParts.length > 0) {
        const style = document.createElement("style");
        style.textContent = cssParts.join("\n");
        document.head.appendChild(style);
    }
}
