import pkg from '../package.json';
import { ManifestType } from '@src/manifest-type';
import manifestDev from './manifest.dev';

let manifest: ManifestType = {
  manifest_version: 3,
  default_locale: 'zh_CN',
  name: '__MSG_extName__',
  version: pkg.version,
  description: '__MSG_extDesc__',
  // options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module'
  },
  action: {
    default_popup: 'src/pages/popup/index.html'
  },
  // chrome_url_overrides: {
  //   newtab: 'src/pages/newtab/index.html',
  // },
  icons: {
    '16': 'icon-64.png',
    '48': 'icon-64.png',
    '128': 'icon-64.png'
  },
  // devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: [],
      matches: []
    }
  ],
  permissions: ['storage', 'cookies', 'tabs'],
  host_permissions: ['<all_urls>'],
  content_scripts: [
    {
      matches: ['<all_urls>'],
      // exclude_matches: PATTERN_DOCS_EXCLUDE,
      js: ['src/pages/content/index.js'],
      all_frames: false,
      run_at: 'document_start'
    }
  ]
};

const isDev = process.env.__DEV__ === 'true';

if (isDev) {
  manifest = manifestDev(manifest);
}

export default manifest;
