import { request } from "./request";

export async function search(params: { keywords: string }) {
  return request<{
    list: {
      cosmoUrl: string;
      docName: string;
      owner: {
        name: string;
      };
    }[];
  }>({
    url: "https://docs.corp.kuaishou.com/merlot/api/searchs/search",
    method: "POST",
    body: params,
  });
}
