// import DocsCornerTipContentService from "@src/services/docs/cornerTip/DocsCornerTipContentService";
import { DocsDisplayModeContentService } from "@src/services/docs/displayMode/DocsDisplayModeContentService";
import { KeepAliveClientService } from "@src/services/keepAlive/KeepAliveClientService";
import { Service } from "@src/services/Service";

const services = [
  DocsDisplayModeContentService,
  KeepAliveClientService,
  // DocsCornerTipContentService,
];

services.forEach((Klass) => {
  Service.getInstance(Klass);
});

console.log("content script loaded");
