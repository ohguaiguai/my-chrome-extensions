import { Service } from "@src/services/Service";
import { DocsDisplayModeService } from "./DocsDisplayModeService";

type IGetDarkState = () => boolean;

interface IBehavior {
  mounted(getDarkState: IGetDarkState): void;
  unmount(): void;
  render(): void;
}

export class DocsDisplayModeContentService extends Service {
  private behavior: IBehavior | null = null;
  private getBehavior(): IBehavior {
    const path = location.pathname.slice(1);

    const isHome = !path.includes("/") || path.startsWith("f/");

    const BehaviorCls = isHome ? DarkClassBehavior : DarkFilterBehavior;

    const { behavior } = this;
    if (behavior) {
      if (behavior instanceof BehaviorCls) {
        return behavior;
      }

      this.behavior = null;
      behavior.unmount();
    }

    const newBehavior = new BehaviorCls();
    this.behavior = newBehavior;
    newBehavior.mounted(this.getDarkState);

    return newBehavior;
  }

  private isDark = false;
  private getDarkState = () => {
    return this.isDark;
  };

  mounted() {
    if (!document.contentType.includes("html")) {
      return;
    }

    this.getInstance(DocsDisplayModeService).onChange(this.onChange);

    window.addEventListener("load", this.listenRouterChange, false);
  }

  private listenRouterChange = () => {
    const title = document.querySelector("title");
    if (!title) {
      return;
    }

    const config = { childList: true };

    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          this.render();
        }
      }
    });

    observer.observe(title, config);
  };

  private onChange = (isDark: boolean) => {
    this.isDark = isDark;

    this.render();
  };

  private render() {
    this.getBehavior().render();
  }
}

class DarkClassBehavior implements IBehavior {
  private getDarkState!: IGetDarkState;
  private observer!: MutationObserver;

  cls = "kim-dark-mode";

  private hackedHome = false;
  private hackHome() {
    if (this.hackedHome) {
      return;
    }
    this.hackedHome = true;
    const config = { attributes: true };

    const observer = new MutationObserver((mutationList) => {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          this.render();
        }
      }
    });

    observer.observe(document.documentElement, config);

    this.observer = observer;

    // window.addEventListener('load', () => {
    //     setTimeout(() => {
    //         observer.disconnect()
    //     }, 1000)
    // })
  }

  mounted(getDarkState: IGetDarkState) {
    this.getDarkState = getDarkState;

    this.hackHome();
  }

  render() {
    const cl = document.documentElement.classList;
    const { cls } = this;

    if (this.getDarkState()) {
      if (!cl.contains(cls)) {
        cl.add(cls);
      }
      return;
    }

    if (cl.contains(cls)) {
      cl.remove(cls);
    }
  }

  unmount() {
    this.observer.disconnect();

    const cl = document.documentElement.classList;

    cl.remove(this.cls);
  }
}

class DarkFilterBehavior implements IBehavior {
  private getDarkState!: IGetDarkState;

  id = "docs-fan-dark-style";
  cls = "docs-fan-dark-html";

  mounted(getDarkState: IGetDarkState) {
    this.getDarkState = getDarkState;

    const { id, cls } = this;

    const s = document.getElementById(id);

    if (s) {
      return;
    }
    const style = document.createElement("style");

    style.id = id;

    const filter = `filter:invert(1)hue-rotate(180deg)`;

    const whiteList = [
      "img",
      "video",
      "canvas",
      "iframe",
      ".bit-common-user-card__header--img",
      //   ".ui-docs-icon",
    ];

    style.textContent = `
.${cls} {background:#000}
.${cls} img,.${cls} video{background:#fff}
.${cls} body{${filter}}
${whiteList.map((selector) => `.${cls} ${selector}`).join(",")}{${filter}}
`;

    (document.head || document.documentElement).append(style);
  }

  render() {
    const { cls } = this;
    const cl = document.documentElement.classList;

    if (this.getDarkState()) {
      if (!cl.contains(cls)) {
        cl.add(cls);
      }
    } else {
      if (cl.contains(cls)) {
        cl.remove(cls);
      }
    }
  }

  unmount() {
    const cl = document.documentElement.classList;

    cl.remove(this.cls);

    const s = document.getElementById(this.id);

    s?.parentNode?.removeChild(s);
  }
}
