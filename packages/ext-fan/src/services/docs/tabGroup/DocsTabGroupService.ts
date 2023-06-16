import { CONFIG_TAB_GROUP, PATTERN_DOCS } from "@src/constants";
import { ConfigService } from "@src/services/config/ConfigService";
import { Service } from "@src/services/Service";
import { isDocsUrl } from "@src/utils/isDocsUrl";
import { Debug } from "@src/utils/logger";
import { TITLE_TABS_GROUP } from "./constants";
import { docsTabGroupLogic } from "./docsTabGroupLogic";

const debug = Debug("DocsTabsGroupService");

export class DocsTabsGroupService extends Service {
  mounted() {
    this.getInstance(ConfigService).useConfig(
      CONFIG_TAB_GROUP,
      false,
      (enabled) => {
        if (enabled) {
          this.groupOrphans();
          this.watch();
        } else {
          this.unwatch();
        }
      },
    );
  }

  private onCommitted = async (
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
  ) => {
    debug("onCommitted", details);

    const isTopFrame = details.frameId === 0;
    if (!isTopFrame) {
      return;
    }

    const tab = await chrome.tabs.get(details.tabId);

    const isDocs = isDocsUrl(tab.pendingUrl || tab.url || "");

    const groupId = tab.groupId;
    const isOrphan = groupId === chrome.tabGroups.TAB_GROUP_ID_NONE;

    const groupInfo = isOrphan ? null : await chrome.tabGroups.get(groupId);

    const isDocsGroup = groupInfo && groupInfo.title === TITLE_TABS_GROUP;

    // doGroup() if is docs tab and not in docs group
    const shouldGroup = isDocs && !isDocsGroup;

    debug("shouldGroup", shouldGroup);

    if (shouldGroup) {
      await this.doGroup([tab]);
      return;
    }

    // ungroup() if not docs tab and is in docs group
    const shouldUngroup = !isDocs && isDocsGroup;
    debug("shouldUngroup", shouldUngroup);

    if (shouldUngroup) {
      await chrome.tabs.ungroup([details.tabId]);
    }
  };

  private watch() {
    // console.log('DocsTabsGroupService.watch')
    chrome.webNavigation.onCommitted.addListener(this.onCommitted);
  }

  private unwatch() {
    chrome.webNavigation.onCommitted.removeListener(this.onCommitted);
  }

  // group orphans on init
  private async groupOrphans() {
    const docsTabs = await chrome.tabs.query({
      url: PATTERN_DOCS,
    });

    const orphanDocsTabs = docsTabs.filter(
      (t) => t.groupId === chrome.tabs.TAB_ID_NONE,
    );

    this.doGroup(orphanDocsTabs);
  }

  private async doGroup(docsTabs: chrome.tabs.Tab[]) {
    const tabGroups = await chrome.tabGroups.query({});

    const tabsInGroup = await Promise.all(
      tabGroups.map((g) =>
        chrome.tabs.query({
          groupId: g.id,
        }),
      ),
    );

    const groupOps = docsTabGroupLogic(docsTabs, tabsInGroup.flat(), tabGroups);

    const docsGroupIds = await Promise.all(
      groupOps.map((op) => chrome.tabs.group(op)),
    );

    await Promise.all(
      docsGroupIds.map((groupId) =>
        chrome.tabGroups.update(groupId, {
          color: "blue",
          title: TITLE_TABS_GROUP,
        }),
      ),
    );
  }
}
