import fs from "node:fs";
import { connection, runWithResult } from "steam-theming-utils";

// This is here since postcss-cli hangs because of cdp
const result = await runWithResult(
	"(async () => (await SteamClient.System.GetSystemInfo()).nSteamVersion)()",
);

fs.writeFileSync("steam_version", result.toString());
connection.close();
