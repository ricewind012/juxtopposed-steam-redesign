import fs from "node:fs";
import path from "node:path";
import yargs from "yargs";
import postcssFunctions from "postcss-functions";
import postcssSass from "@csstools/postcss-sass";
import { selectorReplacerPlugin } from "steam-theming-utils/postcss-plugin";

// Generate an index.css file that imports everything
const { argv } = yargs(process.argv);
const text = fs
	.readdirSync(argv.base, { recursive: true })
	.filter((e) => e.endsWith(".scss"))
	.map((e) => `@import "${e.replace("scss", "css")}";`)
	.join("\n");
fs.writeFileSync(path.join(argv.dir, "index.css"), text);

/**
 * `icon("name")` => `url("data:image/png;base64,${base64}")`
 *
 * @param {string} name File name without the extension.
 */
function icon(name) {
	const file = path.join("assets", "icons", `${name.replace(/"/g, "")}.svg`);
	const base64 = fs.readFileSync(file, { encoding: "base64" });

	return `url("data:image/svg+xml;base64,${base64}")`;
}

const appendImportantPlugin = () => (css) => {
	css.walkRules((rule) => {
		const nodes = rule.nodes.filter((e) => e.parent.selector !== ":root");
		for (const node of nodes) {
			console.log(node.parent.selector);
			node.important = true;
		}
	});
};
appendImportantPlugin.postcss = true;

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
				icon,
			},
		}),
		appendImportantPlugin(),
	],
};
