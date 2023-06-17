import { Service } from "../Service";

export class WindowService extends Service {
  async getFocusedWindow() {
    const win = await chrome.windows.getLastFocused();

    const isNormal = win?.type === "normal";

    if (isNormal) {
      return win;
    }

    const wins = await chrome.windows.getAll({
      windowTypes: ["normal"],
    });

    const w = wins[wins.length - 1] as chrome.windows.Window | undefined;

    return w || null;
  }
}
