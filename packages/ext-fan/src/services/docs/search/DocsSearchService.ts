import { OmniboxService } from "@src/services/ominibox/OminixboxService";
import { Service } from "@src/services/Service";
import { TabService } from "@src/services/tab/TabService";
import * as DocsAPI from "@src/utils/api.docs";
import { escape } from "@src/utils/escape";
import { stringIsUrl } from "@src/utils/request";

const formatResult = (docName: string, author: string, url: string) => {
  return {
    description: `${escape(docName)} <dim>- ${escape(
      author,
    )}</dim> <url>${escape(url)}</url>`,
  };
};

export class DocsSearchService extends Service {
  mounted() {
    const omnibox = this.getInstance(OmniboxService);

    omnibox.onInput(this.onInput, 200);
    omnibox.onEnter(this.onEnter);
  }

  private onEnter = (text: string) => {
    const newURL = stringIsUrl(text)
      ? text
      : "https://docs.corp.kuaishou.com/home?s_keywords=" +
        encodeURIComponent(text);

    this.getInstance(TabService).openTab(newURL);
  };

  private onInput = async (text: string) => {
    const response = await DocsAPI.search({
      keywords: text,
    });

    if (response.status !== 200 || response.code !== 0) {
      return [];
    }

    const docs = response.result?.list || [];
    const suggestOptions = docs.map((doc) => {
      return {
        content: doc.cosmoUrl,
        // IMP: reg fix xml escape & -> &amp;
        ...formatResult(doc.docName, doc.owner.name, doc.cosmoUrl),
      };
    });

    console.log(text, suggestOptions);

    return suggestOptions;
  };
}
