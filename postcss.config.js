import fs from "node:fs";
import postcssFunctions from "postcss-functions";
import postcssSass from "@csstools/postcss-sass";
import { selectorReplacerPlugin } from "steam-theming-utils/postcss-plugin";

const result = fs.readFileSync("steam_version").toString();
const getSteamVersion = () => `"${result}"`;

/** @type {import("postcss-load-config").Config} */
export default {
	map: false,
	plugins: [
		selectorReplacerPlugin(),
		postcssSass({
			silenceDeprecations: ["legacy-js-api"],
		}),
		postcssFunctions({
			functions: {
				"steam-version": getSteamVersion,
			},
		}),
	],
};
