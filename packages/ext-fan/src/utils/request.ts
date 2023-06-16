export function stringIsUrl(text: string) {
  return /^https:\/\//.test(text);
}

export const querystring = {
  stringify(obj: Record<string, unknown>) {
    return Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join("&");
  },
};

export const request = async <T>(options: {
  url: string;
  headers?: Record<string, string>;
  body?: object;
  method?: string;
}): Promise<{
  status: number;
  code: number;
  result: T | null;
  message: string;
}> => {
  const {
    url,
    headers: headersOption,
    body: bodyOption,
    method = "GET",
  } = options;

  const body = bodyOption ? JSON.stringify(bodyOption) : undefined;

  const res = await fetch(url, {
    method,
    headers: buildHeaders(headersOption || {}),
    body,
  });

  let json;
  try {
    json = await res.json();
  } catch (e) {
    // ignore
  }

  return {
    status: res.status,
    code: json?.code ?? -1,
    result: json?.result ?? null,
    message: json?.message ?? "Unknown error",
  };
};

function buildHeaders(headersOption: Record<string, string>) {
  const headersOptions: Record<string, string> = {
    "Content-Type": "application/json",
    ...headersOption,
  };
  const headers = new Headers();

  Object.keys(headersOptions).forEach((key) => {
    headers.append(key, headersOptions[key]);
  });

  return headers;
}
