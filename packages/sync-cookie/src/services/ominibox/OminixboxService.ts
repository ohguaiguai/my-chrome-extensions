import { Service } from "../Service";

export class OmniboxService extends Service {
  // docs 检索被激活
  onActive(
    fn: Parameters<typeof chrome.omnibox.onInputStarted.addListener>[0],
  ) {
    chrome.omnibox.onInputStarted.addListener(fn);
  }

  // 选择结果回车
  onEnter(fn: Parameters<typeof chrome.omnibox.onInputEntered.addListener>[0]) {
    chrome.omnibox.onInputEntered.addListener(fn);
  }

  // 输入ing
  onInput(
    fn: (text: string) => Promise<chrome.omnibox.SuggestResult[]>,
    throttle: number,
  ) {
    let inputText = "";
    let inputTimeout: ReturnType<typeof setTimeout>;

    chrome.omnibox.onInputChanged.addListener((text, suggest) => {
      inputText = text;

      if (!text) {
        return;
      }

      const delaySuggest = async () => {
        if (inputText !== text) {
          return;
        }

        let suggestOptions: chrome.omnibox.SuggestResult[] = [];
        try {
          suggestOptions = await fn(text);
        } catch (e) {
          // ignore
        }

        if (inputText !== text) {
          return;
        }

        if (0 === suggestOptions.length) {
          return;
        }

        suggest(suggestOptions);
      };

      clearTimeout(inputTimeout);
      inputTimeout = setTimeout(delaySuggest, throttle);
    });
  }
}
