import { CONFIG_TAB_NAV, HOSTS_DOCS } from '@src/constants';
import { ConfigService } from '@src/services/config/ConfigService';
import { Service } from '@src/services/Service';
import { isDocsUrl } from '@src/utils/isDocsUrl';
import { Debug } from '@src/utils/logger';

const findTabByUrl = async (windowId: number, url: string) => {
  const docsTabs = await chrome.tabs.query({
    windowId,
    url
  });
  return docsTabs;
};

const parseUrl = (url: string) => {
  const u = new URL(url);

  u.search = '';

  return u.toString().split('#');
};

const debug = Debug('DocsTabNavService');

const filterUrl = HOSTS_DOCS.map((h) => ({
  hostEquals: h
}));

export class DocsTabNavService extends Service {
  mounted() {
    this.getInstance(ConfigService).useConfig(CONFIG_TAB_NAV, false, (mode) => {
      if (mode) {
        this.watch();
      } else {
        this.unwatch();
      }
    });
  }

  private watch() {
    chrome.webNavigation.onBeforeNavigate.addListener(this.onBeforeNavigate, {
      url: filterUrl
    });
  }

  private unwatch() {
    chrome.webNavigation.onBeforeNavigate.removeListener(this.onBeforeNavigate);
  }

  private onBeforeNavigate = async (
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails
  ) => {
    debug('onBeforeNavigate', details);

    const isTopFrame = details.frameId === 0;
    if (!isTopFrame) {
      return;
    }

    const isDocs = isDocsUrl(details.url);

    if (isDocs) {
      await this.routeToDocsTabIfExist(details.tabId, details.url);
    }
  };

  private async routeToDocsTabIfExist(tabId: number, url: string) {
    debug('routeToDocsTabIfExist', tabId);
    const { windowId } = await chrome.tabs.get(tabId);
    debug('windowId', windowId);

    const [href, hash] = parseUrl(url);
    debug('findTabByUrl', href);
    const foundTabs = await findTabByUrl(windowId, href);

    debug('foundTabs', foundTabs);

    const firstTab = foundTabs.find((item) => item.id !== tabId);

    const firstTabWindowId = firstTab?.windowId;
    const firstTabId = firstTab?.id;
    if (!firstTab || !firstTabWindowId || !firstTabId) {
      return;
    }

    debug('active', firstTabId);

    await chrome.tabs.update(firstTabId, {
      active: true
    });

    if (hash) {
      debug('hash', hash);

      chrome.tabs.update(firstTabId, {
        url: `${href}#${hash}`
      });
    }
    console.log('DocsTabNavService', '111111111');
    debug('remove', tabId);

    await chrome.tabs.remove(tabId!);
  }
}
