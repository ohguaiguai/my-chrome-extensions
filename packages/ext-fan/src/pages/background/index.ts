// import ContentEvalService from "@src/services/content/ContentEvalService";
import { DocsSearchService } from '@src/services/docs/search/DocsSearchService';
import { DocsTabsGroupService } from '@src/services/docs/tabGroup/DocsTabGroupService';
import { DocsTabNavService } from '@src/services/docs/tabNav/DocsTabNavService';
import { KeepAliveServerService } from '@src/services/keepAlive/KeepAliveServerService';
import { Service } from '@src/services/Service';

const services = [
  DocsSearchService,
  DocsTabsGroupService,
  DocsTabNavService,
  KeepAliveServerService
  // ContentEvalService,
];

services.forEach((Klass) => {
  Service.getInstance(Klass);
});

console.log('background script loaded');

// const a = new DocsSearchService(Symbol());
// console.log('index', '1111', a);
