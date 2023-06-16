import {
  CONFIG_DISPLAY_MODE,
  CONFIG_DISPLAY_MODE_AUTO,
  CONFIG_DISPLAY_MODE_LIGHT,
  CONFIG_DISPLAY_MODE_DARK,
} from "@src/constants";
import { ConfigService } from "@src/services/config/ConfigService";
import { Service } from "@src/services/Service";

type IListener = (isDark: boolean) => void;
export class DocsDisplayModeService extends Service {
  private matcher = matchMedia("(prefers-color-scheme: dark)");

  private listeners: IListener[] = [];
  private darkState = CONFIG_DISPLAY_MODE_LIGHT;
  mounted() {
    this.matcher.addEventListener("change", this.onChange$);

    this.getInstance(ConfigService).useConfig(
      CONFIG_DISPLAY_MODE,
      CONFIG_DISPLAY_MODE_LIGHT,
      (state) => {
        this.darkState = state;

        this.onChange$();
      },
    );
  }

  private isDark() {
    return (
      this.darkState === CONFIG_DISPLAY_MODE_DARK ||
      (this.darkState === CONFIG_DISPLAY_MODE_AUTO && this.matcher.matches)
    );
  }

  private onChange$ = () => {
    const listeners = this.listeners.slice();

    const isDark = this.isDark();
    listeners.forEach((fn) => {
      fn(isDark);
    });
  };

  onChange(listener: IListener) {
    this.listeners.push(listener);
    listener(this.isDark());
  }

  offChange(listener: IListener) {
    this.listeners = this.listeners.filter((f) => f !== listener);
  }
}
