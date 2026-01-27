import fs from "node:fs";
import path from "node:path";
import postcssSassPlugin from "@csstools/postcss-sass";
import removeComments from "postcss-discard-comments";
import postcssFunctions from "postcss-functions";
import postcssSassParser from "postcss-scss";
import {
	appendImportantPlugin,
	selectorReplacerPlugin,
} from "steam-theming-utils/postcss-plugins";

const unquote = (str) => str.replace(/"/g, "");

const functions = {
	/**
	 * Output: `file("name")` => `url("data:image/svg+xml;base64,${base64}")`
	 *
	 * @param {string} name File name without the extension.
	 */
	file: (name) => {
		const fileName = `${unquote(name)}.svg`;
		const file = path.join("assets", "icons", fileName);
		const base64 = fs.readFileSync(file, { encoding: "base64" });

		return `url("data:image/svg+xml;base64,${base64}")`;
	},

	/**
	 * Output: `icon("name")` => `var(--icon-${name})`
	 *
	 * @param {string} name File name without the extension.
	 */
	icon: (name) => {
		return `var(--icon-${unquote(name)})`;
	},
};

/** @type {import("postcss-load-config").Config} */
export default {
	map: false,
	parser: postcssSassParser,
	plugins: [
		postcssSassPlugin({
			// TODO: use "loadPaths" when @csstools/postcss-sass switches to
			// normal sass API.
			includePaths: ["src/mixins"],
			silenceDeprecations: ["legacy-js-api", "mixed-decls"],
		}),
		postcssFunctions({ functions }),
		removeComments(),
		appendImportantPlugin({
			filter: [/^:root/],
		}),
		selectorReplacerPlugin(),
	],
};
