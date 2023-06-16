import { Service } from "../Service";

interface IMessage<T> {
  type: string;
  data: T;
}

export class MessageService extends Service {
  on<T>(
    type: string,
    listener: (msg: IMessage<T>, sender?: chrome.runtime.MessageSender) => void,
  ) {
    const onMessage = (
      msg: IMessage<T>,
      sender: chrome.runtime.MessageSender,
    ) => {
      const t = msg?.type;
      if (t === type) {
        listener(msg, sender);
      }
    };

    chrome.runtime.onMessage.addListener(onMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }

  sendMessage<T>(
    { type, tabId }: {
      type: string;
      tabId?: number;
    },
    data: T,
  ) {
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {
        type,
        data,
      });
      return;
    }
    chrome.runtime.sendMessage({
      type,
      data,
    });
  }
}
