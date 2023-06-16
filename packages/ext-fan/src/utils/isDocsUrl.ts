import { HOSTS_DOCS } from "@src/constants";

export const isDocsUrl = (url: string) =>
  HOSTS_DOCS.some((h) => url.includes(`://${h}/`));
