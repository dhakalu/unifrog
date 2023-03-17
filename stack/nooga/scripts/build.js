import path from "path";
import { fileURLToPath } from "url";
import { build } from "vite";
import { cwd } from "node:process";
import logger from "../logger.js";
import federation from "@originjs/vite-plugin-federation";
import react from "@vitejs/plugin-react";

const __dirname = fileURLToPath(new URL(cwd(), import.meta.url));

let noogaConfigFileLocation;
let packageJSONLocation;
try {
  noogaConfigFileLocation = path.resolve(__dirname, `./nooga.config.js`);
} catch {
  logger.info("Could not find the nooga config file, proceeding with defaults");
}

try {
  packageJSONLocation = path.resolve(__dirname, "./package.json");
} catch (err) {
  logger.error("Error occurred while reading package json. Error is ");
  logger.trace(err);
  process.exit(1);
}

const noogaConfig = noogaConfigFileLocation
  ? (await import(noogaConfigFileLocation)).default
  : {};

const packageJSON = (
  await import(packageJSONLocation, {
    assert: { type: "json" },
  })
).default;

logger.info("Package JSON content are %o", packageJSON);

const plugins = [];

let entryPoint = noogaConfig.entry;
if (!entryPoint) {
  logger.warn("entry is missing in nooga.config.js; defaulting to index.ts");
  entryPoint = "index.ts";
}

logger.info("Entry point is %s", entryPoint);

if (packageJSON?.dependencies?.react || packageJSON?.peerDependencies?.react) {
  logger.info("Detected react. adding react plugin");
  plugins.push(react());
}

if (noogaConfig.isFederated) {
  const exposes = packageJSON.exports;
  if (!exposes) {
    logger.error(
      "Package marked as federated and exports are missing from the package json. \n Exiting... \n Please either remove isFederated from nooga.config.js or add exports in package.json"
    );
    process.exit(1);
  }
  plugins.push(
    federation({
      name: packageJSON.name.split("/")[1],
      filename: "remoteEntry.js",
      exposes,
      shared: [Object.keys(packageJSON.dependencies || {})],
    })
  );
}
const input = entryPoint ? path.resolve(__dirname, entryPoint) : undefined;
logger.info("Entry point is %s", input);
(async () => {
  await build({
    root: path.resolve(__dirname),
    build: {
      rollupOptions: {
        // input,
      },
    },
    plugins: plugins,
  });
})();
