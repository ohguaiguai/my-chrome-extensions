import { Debug, Info } from "../../utils/logger";
import { Service } from "../Service";
import { KEEP_ALIVE_DISCONNECT, KEEP_ALIVE_HEART_BEAT } from "./constants";

const debug = Debug("KeepAliveServerService");
const info = Info("KeepAliveServerService");

export class KeepAliveServerService extends Service {
  mounted() {
    this.setupListener();
  }

  private setupListener() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== KEEP_ALIVE_HEART_BEAT) {
        return;
      }

      let timer = setTimeout(() => {
        debug("auto disconnect", port);

        port.disconnect();
      }, KEEP_ALIVE_DISCONNECT);

      port.onMessage.addListener((message) => {
        info("onMessage", message);

        port.postMessage("pong");
      });

      port.onDisconnect.addListener((port) => {
        debug("onDisconnect", port);

        clearTimeout(timer);
      });
    });
  }
}
