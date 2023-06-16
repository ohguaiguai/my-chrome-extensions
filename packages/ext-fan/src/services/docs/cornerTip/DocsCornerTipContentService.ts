import { Service } from "@src/services/Service";
import React from "react";
import ReactDOM from "react-dom/client";
import { CornerTip } from "@src/components/content/CornerTip";

export class DocsCornerTipContentService extends Service {
  mounted() {
    window.addEventListener(
      "load",
      () => {
        this.initApp();
      },
      false,
    );
  }

  private initApp() {
    const cornerTip = document.querySelector(".k-frame-vodka-corner-tip");
    if (!cornerTip) {
      return;
    }

    const dom = document.createElement("div");
    const root = ReactDOM.createRoot(dom);

    root.render(React.createElement(CornerTip));

    cornerTip.insertBefore(dom, cornerTip.firstChild);
  }
}
