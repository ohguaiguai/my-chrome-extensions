import { Service } from "@src/services/Service";
import { MessageService } from "../message/MessageService";

const EVAL_JS = "EVAL_JS";

const doEval = (js: string) => {
  window.eval(js);
};

export class ContentEvalService extends Service {
  mounted(): void {
    const isBg = chrome.scripting;
    if (isBg) {
      return this.listen();
    }
  }

  private listen() {
    this.getInstance(MessageService).on(EVAL_JS, (msg, sender) => {
      const tabId = sender?.tab?.id;
      if (!tabId) {
        return;
      }
      const code = msg.data as string;
      this.evalInTab(tabId, code);
    });
  }

  private evalInTab(tabId: number, js: string) {
    chrome.scripting.executeScript({
      world: "MAIN",
      func: doEval,
      args: [js],
      target: {
        tabId,
      },
    });
  }

  eval(js: string) {
    this.getInstance(MessageService).sendMessage({ type: EVAL_JS }, js);
  }
}
