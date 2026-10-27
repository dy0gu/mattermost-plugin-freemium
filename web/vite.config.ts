import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import manifest from "../plugin.json" with { type: 'json' };

const entry = fileURLToPath(new URL("./src/main.tsx", import.meta.url));

export default defineConfig({
  logLevel: "warn",
  resolve: {
    tsconfigPaths: true
	},
	build: {
		minify: false,
		sourcemap: true,
		lib: {
			entry,
			name: manifest.name,
			fileName: (format) => `plugin-${format}.js`,
		},
	},
});
