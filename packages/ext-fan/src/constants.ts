export const CONFIG_DISPLAY_MODE = "feat.displayMode";
export const CONFIG_DISPLAY_MODE_LIGHT = "feat.displayMode.light";
export const CONFIG_DISPLAY_MODE_DARK = "feat.displayMode.dark";
export const CONFIG_DISPLAY_MODE_AUTO = "feat.displayMode.auto";

export const CONFIG_VOICE_INPUT = "feat.voiceInput";

export const CONFIG_TAB_GROUP = "feat.tabGroup";

export const CONFIG_TAB_NAV = "feat.tabNav";

export const HOSTS_DOCS = [
  "docs.corp.kuaishou.com",
  "is-docs-test.corp.kuaishou.com",
  "docs.test.gifshow.com",
];

export const PATTERN_DOCS = HOSTS_DOCS.map((h) => `*://${h}/*`);

export const PATTERN_DOCS_EXCLUDE = HOSTS_DOCS.map((h) => `*://${h}/labs*`);

export const LINK_DOC = "https://docs.corp.kuaishou.com/labs/docsfan";

export const LINK_LIKE = "https://docs.corp.kuaishou.com/labs/#p=docsfan";
