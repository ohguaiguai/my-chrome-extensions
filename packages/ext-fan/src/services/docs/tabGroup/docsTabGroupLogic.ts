import { isDocsUrl } from "@src/utils/isDocsUrl";
import { TITLE_TABS_GROUP } from "./constants";

export const docsTabGroupLogic = (
  docsTabs: chrome.tabs.Tab[],
  tabsInGroup: chrome.tabs.Tab[],
  tabGroups: chrome.tabGroups.TabGroup[],
) => {
  // find all docs tab groups
  const docsGroups = tabGroups.filter((tg) => {
    // if title matching
    if (tg.title === TITLE_TABS_GROUP) {
      return true;
    }

    // or if all tabs are docs
    const internalTabs = tabsInGroup.filter((t) => t.groupId === tg.id);

    const isValidGroup = internalTabs.every((t) => isDocsUrl(t.url || ""));

    return isValidGroup;
  });

  const createNewGroup: Map<number, number[]> = new Map();

  const moveToExistGroup: Map<number, number[]> = new Map();

  // turn input tabs into ops
  docsTabs.forEach((t) => {
    const tabId = t.id;
    const windowId = t.windowId;
    if (!tabId) {
      return;
    }

    // find targetGroup within same window
    const targetGroup = docsGroups.find((tg) => tg.windowId === windowId);

    // move to targetGroup if exists,
    // create new tab group otherwise
    const [map, mapKey] = targetGroup
      ? [moveToExistGroup, targetGroup.id]
      : [createNewGroup, windowId];

    let tabIds = map.get(mapKey);

    if (!tabIds) {
      tabIds = [];
      map.set(mapKey, tabIds);
    }

    tabIds.push(tabId);
  });

  const groupOps: {
    createProperties?: {
      windowId: number;
    };
    groupId?: number;
    tabIds: number[];
  }[] = [];

  for (const [windowId, tabIds] of createNewGroup) {
    groupOps.push({
      createProperties: {
        windowId,
      },
      tabIds,
    });
  }

  for (const [groupId, tabIds] of moveToExistGroup) {
    groupOps.push({
      groupId,
      tabIds,
    });
  }

  return groupOps;
};
