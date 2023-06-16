import type d from "../../public/_locales/en/messages.json";

export const i18n = (k: keyof typeof d) => {
  return chrome.i18n.getMessage(k);
};
