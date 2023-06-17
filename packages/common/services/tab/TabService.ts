import { Service } from "../Service";
import { WindowService } from "../window/WindowService";

const URL_NEW_TAB = "chrome://newtab/";

export class TabService extends Service {
  async getActiveTab() {
    const focusedWindow = await this.getInstance(
      WindowService,
    ).getFocusedWindow();

    if (!focusedWindow) {
      return null;
    }

    const wId = focusedWindow.id;

    if (typeof wId !== "number") {
      return null;
    }

    const tabs = await chrome.tabs.query({
      active: true,
      windowId: wId,
    });

    const tab = tabs[tabs.length - 1];

    return tab || null;
  }

  async getCurrentTabAndUrl() {
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    let url = new URL(tab.url || "");
    return { tab, url: url + "" };
  }

  async openTab(url: string) {
    const activeTab = await this.getActiveTab();

    let targetTabId = null;

    if (activeTab?.url === URL_NEW_TAB) {
      const tabId = activeTab.id;
      if (typeof tabId === "number") {
        targetTabId = tabId;
      }
    }

    if (targetTabId) {
      await chrome.tabs.update(targetTabId, {
        url,
      });
      return;
    }

    await chrome.tabs.create({
      url,
    });
  }

  onUpdated(fn: Parameters<typeof chrome.tabs.onUpdated.addListener>[0]) {
    chrome.tabs.onUpdated.addListener(fn);
  }

  offUpdated(fn: Parameters<typeof chrome.tabs.onUpdated.removeListener>[0]) {
    chrome.tabs.onUpdated.removeListener(fn);
  }
}
