import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import manifest from "#/plugin.json";

export default defineConfig({
	plugins: [tsconfigPaths()],
	logLevel: "warn",
	build: {
		minify: false,
		sourcemap: true,
		lib: {
			entry: path.resolve(__dirname, "src/main.tsx"),
			name: manifest.name,
			fileName: (format) => `plugin-${format}.js`,
		},
	},
});
