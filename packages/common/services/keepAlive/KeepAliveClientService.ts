import { Debug, Verbose } from "@src/utils/logger";
import { Service } from "../Service";
import {
  KEEP_ALIVE_HEART_BEAT,
  KEEP_ALIVE_MESSAGE_INTERVAL,
} from "./constants";

const debug = Debug("KeepAliveClientService");
const verbose = Verbose("KeepAliveClientService");

export class KeepAliveClientService extends Service {
  mounted() {
    this.connect();
  }

  private connect() {
    const port = chrome.runtime.connect({
      name: KEEP_ALIVE_HEART_BEAT,
    });

    debug("connect", port);

    const stopPing = this.startPing(port, KEEP_ALIVE_MESSAGE_INTERVAL);

    port.onDisconnect.addListener((port) => {
      debug("onDisconnect", port);

      stopPing();

      this.connect();
    });

    port.onMessage.addListener((message) => {
      verbose("onMessage", message);
    });

    return port;
  }

  private startPing(port: chrome.runtime.Port, interval: number) {
    const heartbeat = () => {
      port.postMessage("ping");

      timer = setTimeout(heartbeat, interval);
    };

    let timer = setTimeout(heartbeat, interval);

    return () => {
      clearTimeout(timer);
    };
  }
}
