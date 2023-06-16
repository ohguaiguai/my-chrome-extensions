import pkg from "../package.json";
import { ManifestType } from "@src/manifest-type";
import manifestDev from "./manifest.dev";
import { PATTERN_DOCS, PATTERN_DOCS_EXCLUDE } from "./constants";

let manifest: ManifestType = {
  manifest_version: 3,
  default_locale: "zh_CN",
  name: "__MSG_extName__",
  version: pkg.version,
  description: "__MSG_extDesc__",
  // options_page: 'src/pages/options/index.html',
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-64.png",
  },
  // chrome_url_overrides: {
  //   newtab: 'src/pages/newtab/index.html',
  // },
  icons: {
    "128": "icon-128.png",
  },
  // devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: [],
      matches: [],
    },
  ],
  omnibox: { keyword: "@docs" },
  permissions: ["tabs", "tabGroups", "storage", "webNavigation"],
  content_scripts: [
    {
      matches: PATTERN_DOCS,
      exclude_matches: PATTERN_DOCS_EXCLUDE,
      js: ["src/pages/content/index.js"],
      all_frames: false,
      run_at: "document_start",
    },
  ],
};

const isDev = process.env.__DEV__ === "true";

if (isDev) {
  manifest = manifestDev(manifest);
}

export default manifest;
